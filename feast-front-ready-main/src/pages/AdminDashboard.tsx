import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, ShoppingCart, UtensilsCrossed, TrendingUp, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DishesManagement from '@/components/admin/DishesManagement';
import OrdersManagement from '@/components/admin/OrdersManagement';
import UsersManagement from '@/components/admin/UsersManagement';
import AdminPasswordPrompt from '@/components/admin/AdminPasswordPrompt';

// Mock data for charts
const orderData = [
  { name: 'Mon', orders: 40, revenue: 2400 },
  { name: 'Tue', orders: 30, revenue: 1398 },
  { name: 'Wed', orders: 20, revenue: 9800 },
  { name: 'Thu', orders: 27, revenue: 3908 },
  { name: 'Fri', orders: 35, revenue: 4800 },
  { name: 'Sat', orders: 45, revenue: 3800 },
  { name: 'Sun', orders: 50, revenue: 4300 },
];

const categoryData = [
  { name: 'Pizza', value: 35 },
  { name: 'Pasta', value: 25 },
  { name: 'Salad', value: 20 },
  { name: 'Dessert', value: 20 },
];

const COLORS = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffa07a'];

const ADMIN_PASSWORD = 'admin123'; // كلمة المرور الافتراضية - يمكن تغييرها
const SESSION_KEY = 'admin_authenticated';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // التحقق من وجود جلسة سابقة
    const savedSession = sessionStorage.getItem(SESSION_KEY);
    if (savedSession === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSuccess = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem(SESSION_KEY, 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(SESSION_KEY);
  };

  // إذا لم يتم التحقق من كلمة المرور، عرض شاشة تسجيل الدخول
  if (!isAuthenticated) {
    return <AdminPasswordPrompt onSuccess={handlePasswordSuccess} correctPassword={ADMIN_PASSWORD} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">لوحة التحكم الإدارية</h1>
            <p className="text-slate-600">إدارة الطلبات والأطباق والمستخدمين</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-slate-500">+12% من الأسبوع الماضي</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الإيرادات</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">30,405 د.ت</div>
              <p className="text-xs text-slate-500">+8% من الأسبوع الماضي</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الأطباق النشطة</CardTitle>
              <UtensilsCrossed className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-slate-500">+3 أطباق جديدة</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المستخدمون النشطون</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128</div>
              <p className="text-xs text-slate-500">+15 مستخدم جديد</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-white border border-slate-200 rounded-lg p-1">
            <TabsTrigger value="overview" className="text-sm">نظرة عامة</TabsTrigger>
            <TabsTrigger value="dishes" className="text-sm">الأطباق</TabsTrigger>
            <TabsTrigger value="orders" className="text-sm">الطلبات</TabsTrigger>
            <TabsTrigger value="users" className="text-sm">المستخدمون</TabsTrigger>
            <TabsTrigger value="analytics" className="text-sm">التحليلات</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>الطلبات والإيرادات</CardTitle>
                  <CardDescription>آخر 7 أيام</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={orderData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="orders" fill="#3b82f6" name="الطلبات" />
                      <Bar dataKey="revenue" fill="#10b981" name="الإيرادات" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>توزيع الأطباق</CardTitle>
                  <CardDescription>حسب الفئة</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>الإيرادات اليومية</CardTitle>
                <CardDescription>اتجاه الإيرادات</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={orderData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="الإيرادات" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dishes Tab */}
          <TabsContent value="dishes">
            <DishesManagement />
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <OrdersManagement />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <UsersManagement />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>إحصائيات متقدمة</CardTitle>
                <CardDescription>تحليل شامل للأداء</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-slate-600">متوسط قيمة الطلب</p>
                    <p className="text-2xl font-bold text-blue-600">123 د.ت</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-slate-600">معدل التحويل</p>
                    <p className="text-2xl font-bold text-green-600">3.2%</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm text-slate-600">الطلب الأكثر شيوعاً</p>
                    <p className="text-2xl font-bold text-orange-600">بيتزا</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-slate-600">معدل الرضا</p>
                    <p className="text-2xl font-bold text-purple-600">4.8/5</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
