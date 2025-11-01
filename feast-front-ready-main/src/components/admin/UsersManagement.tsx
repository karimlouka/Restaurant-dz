import { useState, useEffect } from 'react';
import { fetchData, sendData, API_ENDPOINTS } from '@/api/apiConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Eye, Search, Trash2, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive' | 'blocked';
  lastOrder: string;
}

// تم حذف البيانات الوهمية initialUsers


const statusConfig = {
  active: { label: 'نشط', color: 'bg-green-100 text-green-800' },
  inactive: { label: 'غير نشط', color: 'bg-yellow-100 text-yellow-800' },
  blocked: { label: 'محظور', color: 'bg-red-100 text-red-800' },
};

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchData<User[]>(API_ENDPOINTS.users);
      setUsers(data);
      toast.success('تم تحميل قائمة المستخدمين بنجاح');
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('فشل في تحميل المستخدمين من الخادم.');
      toast.error('فشل في تحميل المستخدمين.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const handleToggleStatus = async (user: User, newStatus: 'active' | 'inactive' | 'blocked') => {
    try {
      // Send update request to API
      await sendData<User>(`${API_ENDPOINTS.users}/${user.id}`, 'PUT', { ...user, status: newStatus });
      
      // Update local state and show success message
      setUsers(users.map(u =>
        u.id === user.id ? { ...u, status: newStatus } : u
      ));
      toast.success('تم تحديث حالة المستخدم بنجاح');
    } catch (err) {
      console.error('Failed to update user status:', err);
      toast.error(`فشل في تحديث حالة المستخدم: ${err instanceof Error ? err.message : 'خطأ غير معروف'}`);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await sendData<{}>(`${API_ENDPOINTS.users}/${userId}`, 'DELETE');
      toast.success('تم حذف المستخدم بنجاح');
      fetchUsers(); // Refetch data
    } catch (err) {
      console.error('Failed to delete user:', err);
      toast.error(`فشل في حذف المستخدم: ${err instanceof Error ? err.message : 'خطأ غير معروف'}`);
    }
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    blocked: users.filter(u => u.status === 'blocked').length,
    totalSpent: users.reduce((sum, u) => sum + u.totalSpent, 0),
    totalOrders: users.reduce((sum, u) => sum + u.totalOrders, 0),
  };

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="p-6 text-center text-blue-500">
          جاري تحميل المستخدمين...
        </div>
      )}
      {error && (
        <div className="p-6 text-center text-red-500">
          {error}
        </div>
      )}
      {(!isLoading && !error) && (
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-xs text-slate-600 mt-1">إجمالي المستخدمين</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              <p className="text-xs text-slate-600 mt-1">نشطون</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{stats.totalOrders}</p>
              <p className="text-xs text-slate-600 mt-1">إجمالي الطلبات</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.totalSpent} د.ت</p>
              <p className="text-xs text-slate-600 mt-1">إجمالي الإنفاق</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <CardTitle>إدارة المستخدمين</CardTitle>
              <CardDescription>عرض وإدارة بيانات المستخدمين والعملاء</CardDescription>
            </div>
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="ابحث عن مستخدم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 w-full"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-200 hover:bg-transparent">
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="text-right">البريد الإلكتروني</TableHead>
                  <TableHead className="text-right">الهاتف</TableHead>
                  <TableHead className="text-right">الطلبات</TableHead>
                  <TableHead className="text-right">الإنفاق</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                      لا توجد مستخدمين متطابقين
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => {
                    const statusInfo = statusConfig[user.status];
                    return (
                      <TableRow key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <TableCell className="font-semibold">{user.name}</TableCell>
                        <TableCell className="text-sm">{user.email}</TableCell>
                        <TableCell className="text-sm">{user.phone}</TableCell>
                        <TableCell className="text-center font-semibold">{user.totalOrders}</TableCell>
                        <TableCell className="font-semibold text-blue-600">{user.totalSpent} د.ت</TableCell>
	                        <TableCell>
	                          <Select
	                            value={user.status}
	                            onValueChange={(value) => handleToggleStatus(user, value as 'active' | 'inactive' | 'blocked')}
	                          >
	                            <SelectTrigger className={`w-32 text-sm font-medium border-0 ${statusInfo.color}`}>
	                              <SelectValue />
	                            </SelectTrigger>
	                            <SelectContent>
	                              <SelectItem value="active">نشط</SelectItem>
	                              <SelectItem value="inactive">غير نشط</SelectItem>
	                              <SelectItem value="blocked">محظور</SelectItem>
	                            </SelectContent>
	                          </Select>
	                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2">
                            <Dialog open={isDetailsOpen && selectedUser?.id === user.id} onOpenChange={setIsDetailsOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewDetails(user)}
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              {selectedUser?.id === user.id && (
                                <DialogContent className="max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>بيانات المستخدم</DialogTitle>
                                    <DialogDescription>{selectedUser.name}</DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-3">
                                        <Mail className="h-4 w-4 text-slate-500" />
                                        <div>
                                          <p className="text-xs text-slate-600">البريد الإلكتروني</p>
                                          <p className="font-semibold">{selectedUser.email}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <Phone className="h-4 w-4 text-slate-500" />
                                        <div>
                                          <p className="text-xs text-slate-600">الهاتف</p>
                                          <p className="font-semibold">{selectedUser.phone}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <MapPin className="h-4 w-4 text-slate-500" />
                                        <div>
                                          <p className="text-xs text-slate-600">العنوان</p>
                                          <p className="font-semibold">{selectedUser.address}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <Calendar className="h-4 w-4 text-slate-500" />
                                        <div>
                                          <p className="text-xs text-slate-600">تاريخ الانضمام</p>
                                          <p className="font-semibold">{selectedUser.joinDate}</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="border-t pt-4">
                                      <div className="grid grid-cols-3 gap-3 mb-4">
                                        <div className="text-center">
                                          <p className="text-2xl font-bold text-blue-600">{selectedUser.totalOrders}</p>
                                          <p className="text-xs text-slate-600">الطلبات</p>
                                        </div>
                                        <div className="text-center">
                                          <p className="text-2xl font-bold text-green-600">{selectedUser.totalSpent}</p>
                                          <p className="text-xs text-slate-600">د.ت</p>
                                        </div>
                                        <div className="text-center">
                                          <p className="text-lg font-bold text-orange-600">{(selectedUser.totalSpent / selectedUser.totalOrders).toFixed(0)}</p>
                                          <p className="text-xs text-slate-600">متوسط</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <p className="text-sm font-semibold text-slate-700">تغيير الحالة:</p>
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          variant={selectedUser.status === 'active' ? 'default' : 'outline'}
                                          onClick={() => handleToggleStatus(selectedUser.id, 'active')}
                                          className="flex-1"
                                        >
                                          نشط
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant={selectedUser.status === 'inactive' ? 'default' : 'outline'}
                                          onClick={() => handleToggleStatus(selectedUser.id, 'inactive')}
                                          className="flex-1"
                                        >
                                          غير نشط
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant={selectedUser.status === 'blocked' ? 'destructive' : 'outline'}
                                          onClick={() => handleToggleStatus(selectedUser.id, 'blocked')}
                                          className="flex-1"
                                        >
                                          محظور
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              )}
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>حذف المستخدم</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    هل أنت متأكد من حذف {user.name}؟ لا يمكن التراجع عن هذا الإجراء.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="flex gap-2">
                                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
	                              <AlertDialogAction onClick={() => handleDeleteUser(user.id)} className="bg-red-600 hover:bg-red-700">
                                    حذف
                                  </AlertDialogAction>
                                </div>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
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

      {/* Info Box */}
      <Card className="border-0 shadow-sm bg-blue-50 border-l-4 border-blue-500">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-800">
            <strong>ملاحظة:</strong> يمكنك عرض تفاصيل المستخدم الكاملة بما في ذلك سجل الطلبات والعنوان من خلال النقر على أيقونة العين. كما يمكنك تغيير حالة المستخدم أو حذفه من النظام.
          </p>
        </CardContent>
      </Card>
    </div>
  )}
  );
}
