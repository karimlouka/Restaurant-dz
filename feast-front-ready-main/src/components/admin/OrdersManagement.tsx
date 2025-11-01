import { useState, useEffect } from 'react';
import { fetchData, sendData, API_ENDPOINTS } from '@/api/apiConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Eye, Search, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  items: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: string;
  notes: string;
}

// تم حذف البيانات الوهمية initialOrders


const statusConfig = {
  pending: { label: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  confirmed: { label: 'مؤكد', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  preparing: { label: 'قيد التحضير', color: 'bg-purple-100 text-purple-800', icon: Clock },
  ready: { label: 'جاهز', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  delivered: { label: 'تم التسليم', color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
  cancelled: { label: 'ملغى', color: 'bg-red-100 text-red-800', icon: XCircle },
};

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchData<Order[]>(API_ENDPOINTS.orders);
      setOrders(data);
      toast.success('تم تحميل قائمة الطلبات بنجاح');
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('فشل في تحميل الطلبات من الخادم.');
      toast.error('فشل في تحميل الطلبات.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.includes(searchTerm) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (orderId: number, newStatus: Order['status']) => {
    try {
      // Find the order to get its current data
      const orderToUpdate = orders.find(o => o.id === orderId);
      if (!orderToUpdate) {
        throw new Error('الطلب غير موجود');
      }

      // Send update request to API
      await sendData<Order>(`${API_ENDPOINTS.orders}/${orderId}`, 'PUT', { ...orderToUpdate, status: newStatus });
      
      // Update local state and show success message
      setOrders(orders.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      ));
      toast.success('تم تحديث حالة الطلب بنجاح');
    } catch (err) {
      console.error('Failed to update order status:', err);
      toast.error(`فشل في تحديث حالة الطلب: ${err instanceof Error ? err.message : 'خطأ غير معروف'}`);
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const getStatusStats = () => {
    return {
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      ready: orders.filter(o => o.status === 'ready').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };
  };

  const stats = getStatusStats();

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="p-6 text-center text-blue-500">
          جاري تحميل الطلبات...
        </div>
      )}
      {error && (
        <div className="p-6 text-center text-red-500">
          {error}
        </div>
      )}
      {(!isLoading && !error) && (
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-xs text-slate-600 mt-1">قيد الانتظار</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
              <p className="text-xs text-slate-600 mt-1">مؤكد</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.preparing}</p>
              <p className="text-xs text-slate-600 mt-1">قيد التحضير</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.ready}</p>
              <p className="text-xs text-slate-600 mt-1">جاهز</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">{stats.delivered}</p>
              <p className="text-xs text-slate-600 mt-1">تم التسليم</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              <p className="text-xs text-slate-600 mt-1">ملغى</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <CardTitle>إدارة الطلبات</CardTitle>
              <CardDescription>عرض وتحديث حالة الطلبات</CardDescription>
            </div>
            <div className="flex gap-2 flex-col md:flex-row">
              <div className="relative flex-1 md:flex-none">
                <Search className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="ابحث عن طلب..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 w-full"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="تصفية حسب الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="pending">قيد الانتظار</SelectItem>
                  <SelectItem value="confirmed">مؤكد</SelectItem>
                  <SelectItem value="preparing">قيد التحضير</SelectItem>
                  <SelectItem value="ready">جاهز</SelectItem>
                  <SelectItem value="delivered">تم التسليم</SelectItem>
                  <SelectItem value="cancelled">ملغى</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-200 hover:bg-transparent">
                  <TableHead className="text-right">رقم الطلب</TableHead>
                  <TableHead className="text-right">العميل</TableHead>
                  <TableHead className="text-right">الهاتف</TableHead>
                  <TableHead className="text-right">الإجمالي</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">الوقت</TableHead>
                  <TableHead className="text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                      لا توجد طلبات متطابقة
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => {
                    const statusInfo = statusConfig[order.status];
                    return (
                      <TableRow key={order.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <TableCell className="font-bold text-blue-600">{order.orderNumber}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell className="text-sm">{order.customerPhone}</TableCell>
                        <TableCell className="font-semibold">{order.totalPrice} د.ت</TableCell>
                        <TableCell>
                            <Select
                              value={order.status}
                              onValueChange={(value) => handleStatusChange(order.id, value as Order['status'])}
                            >
                            <SelectTrigger className={`w-32 text-sm font-medium border-0 ${statusInfo.color}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">قيد الانتظار</SelectItem>
                              <SelectItem value="confirmed">مؤكد</SelectItem>
                              <SelectItem value="preparing">قيد التحضير</SelectItem>
                              <SelectItem value="ready">جاهز</SelectItem>
                              <SelectItem value="delivered">تم التسليم</SelectItem>
                              <SelectItem value="cancelled">ملغى</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">{order.createdAt}</TableCell>
                        <TableCell className="text-center">
                          <Dialog open={isDetailsOpen && selectedOrder?.id === order.id} onOpenChange={setIsDetailsOpen}>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDetails(order)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            {selectedOrder?.id === order.id && (
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>تفاصيل الطلب {selectedOrder.orderNumber}</DialogTitle>
                                  <DialogDescription>معلومات كاملة عن الطلب</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-slate-600">اسم العميل</Label>
                                      <p className="font-semibold">{selectedOrder.customerName}</p>
                                    </div>
                                    <div>
                                      <Label className="text-slate-600">الهاتف</Label>
                                      <p className="font-semibold">{selectedOrder.customerPhone}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-slate-600">المنتجات</Label>
                                    <p className="font-semibold text-sm">{selectedOrder.items}</p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-slate-600">الإجمالي</Label>
                                      <p className="font-bold text-lg text-blue-600">{selectedOrder.totalPrice} د.ت</p>
                                    </div>
                                    <div>
                                      <Label className="text-slate-600">الوقت</Label>
                                      <p className="font-semibold">{selectedOrder.createdAt}</p>
                                    </div>
                                  </div>
                                  {selectedOrder.notes && (
                                    <div>
                                      <Label className="text-slate-600">ملاحظات</Label>
                                      <p className="text-sm bg-yellow-50 p-2 rounded border border-yellow-200">{selectedOrder.notes}</p>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            )}
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )}
  );
}
