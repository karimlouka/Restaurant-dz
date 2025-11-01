import { useState, useEffect } from 'react';
import { fetchData, sendData, API_ENDPOINTS } from '@/api/apiConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

export default function DishesManagement() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDishes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchData<Dish[]>(API_ENDPOINTS.dishes);
      setDishes(data);
      toast.success('تم تحميل قائمة الأطباق بنجاح');
    } catch (err) {
      console.error('Failed to fetch dishes:', err);
      setError('فشل في تحميل الأطباق من الخادم.');
      toast.error('فشل في تحميل الأطباق.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    available: true,
  });

  const filteredDishes = dishes.filter(dish =>
    dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dish.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (dish?: Dish) => {
    if (dish) {
      setEditingDish(dish);
      setFormData({
        name: dish.name,
        description: dish.description,
        price: dish.price.toString(),
        category: dish.category,
        available: dish.available,
      });
    } else {
      setEditingDish(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        available: true,
      });
    }
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const dishData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      available: formData.available,
      // يجب أن يتم التعامل مع الصورة في الـ Backend
      image: editingDish?.image || 'https://via.placeholder.com/100',
    };

    try {
      if (editingDish) {
        // Update existing dish
        await sendData<Dish>(`${API_ENDPOINTS.dishes}/${editingDish.id}`, 'PUT', dishData);
        toast.success('تم تحديث الطبق بنجاح');
      } else {
        // Create new dish
        await sendData<Dish>(API_ENDPOINTS.dishes, 'POST', dishData);
        toast.success('تم إضافة الطبق بنجاح');
      }
      
      // Refetch data to update the list
      fetchDishes();
      setIsOpen(false);
    } catch (err) {
      console.error('Failed to save dish:', err);
      toast.error(`فشل في حفظ الطبق: ${err instanceof Error ? err.message : 'خطأ غير معروف'}`);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await sendData<{}>(`${API_ENDPOINTS.dishes}/${id}`, 'DELETE');
      toast.success('تم حذف الطبق بنجاح');
      fetchDishes(); // Refetch data
    } catch (err) {
      console.error('Failed to delete dish:', err);
      toast.error(`فشل في حذف الطبق: ${err instanceof Error ? err.message : 'خطأ غير معروف'}`);
    }
  };

  const handleToggleAvailability = async (dish: Dish) => {
    const newAvailability = !dish.available;
    try {
      await sendData<Dish>(`${API_ENDPOINTS.dishes}/${dish.id}`, 'PUT', { ...dish, available: newAvailability });
      toast.success('تم تحديث حالة الطبق بنجاح');
      fetchDishes(); // Refetch data
    } catch (err) {
      console.error('Failed to toggle availability:', err);
      toast.error(`فشل في تحديث حالة الطبق: ${err instanceof Error ? err.message : 'خطأ غير معروف'}`);
    }
  };

	  return (
	    <Card className="border-0 shadow-lg">
	      {isLoading && (
	        <div className="p-6 text-center text-blue-500">
	          جاري تحميل الأطباق...
	        </div>
	      )}
	      {error && (
	        <div className="p-6 text-center text-red-500">
	          {error}
	        </div>
	      )}
	      {(!isLoading && !error) && (
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>إدارة الأطباق</CardTitle>
            <CardDescription>أضف وعدّل وحذف الأطباق والأسعار</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="h-4 w-4" />
                إضافة طبق جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingDish ? 'تعديل الطبق' : 'إضافة طبق جديد'}</DialogTitle>
                <DialogDescription>
                  {editingDish ? 'قم بتحديث معلومات الطبق' : 'أدخل معلومات الطبق الجديد'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">اسم الطبق</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="مثال: بيتزا مارغريتا"
                  />
                </div>
                <div>
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="وصف الطبق"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">السعر (د.ت)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="25"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">الفئة</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر فئة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="بيتزا">بيتزا</SelectItem>
                        <SelectItem value="باستا">باستا</SelectItem>
                        <SelectItem value="سلطات">سلطات</SelectItem>
                        <SelectItem value="حلويات">حلويات</SelectItem>
                        <SelectItem value="مشروبات">مشروبات</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="available"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="available" className="cursor-pointer">متوفر الآن</Label>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} className="flex-1">
                    {editingDish ? 'تحديث' : 'إضافة'}
                  </Button>
                  <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                    إلغاء
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="ابحث عن طبق..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-200 hover:bg-transparent">
                <TableHead className="text-right">اسم الطبق</TableHead>
                <TableHead className="text-right">الفئة</TableHead>
                <TableHead className="text-right">السعر</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-center">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDishes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                    لا توجد أطباق متطابقة
                  </TableCell>
                </TableRow>
              ) : (
                filteredDishes.map((dish) => (
                  <TableRow key={dish.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <TableCell className="font-medium">{dish.name}</TableCell>
                    <TableCell>{dish.category}</TableCell>
                    <TableCell>{dish.price} د.ت</TableCell>
                    <TableCell>
	                      <button
	                        onClick={() => handleToggleAvailability(dish)}
	                        className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                          dish.available
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {dish.available ? 'متوفر' : 'غير متوفر'}
                      </button>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
	                        <Button
	                          variant="ghost"
	                          size="sm"
	                          onClick={() => handleOpenDialog(dish)}
	                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
	                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
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
                              <AlertDialogTitle>حذف الطبق</AlertDialogTitle>
                              <AlertDialogDescription>
                                هل أنت متأكد من حذف {dish.name}؟ لا يمكن التراجع عن هذا الإجراء.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="flex gap-2">
                              <AlertDialogCancel>إلغاء</AlertDialogCancel>
	                              <AlertDialogAction onClick={() => handleDelete(dish.id)} className="bg-red-600 hover:bg-red-700">
                                حذف
                              </AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>ملاحظة:</strong> يمكنك تغيير حالة توفر الطبق بالنقر على الحالة مباشرة، أو تعديل السعر والتفاصيل من خلال زر التعديل.
          </p>
        </div>
      </CardContent>
	    </Card>
	  )}
	  );
	}
