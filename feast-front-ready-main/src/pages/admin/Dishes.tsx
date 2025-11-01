import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Dish {
  id: string;
  name: string;
  name_ar: string | null;
  description: string | null;
  description_ar: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  category_id: string | null;
}

export default function Dishes() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [open, setOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    name_ar: "",
    description: "",
    description_ar: "",
    price: "",
    image_url: "",
    is_available: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    const { data } = await supabase.from("dishes").select("*").order("created_at", { ascending: false });
    if (data) setDishes(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSubmit = {
      ...formData,
      price: parseFloat(formData.price),
    };

    if (editingDish) {
      const { error } = await supabase
        .from("dishes")
        .update(dataToSubmit)
        .eq("id", editingDish.id);

      if (error) {
        toast({ variant: "destructive", title: "خطأ في التحديث" });
      } else {
        toast({ title: "تم تحديث الطبق بنجاح" });
      }
    } else {
      const { error } = await supabase.from("dishes").insert([dataToSubmit]);

      if (error) {
        toast({ variant: "destructive", title: "خطأ في الإضافة" });
      } else {
        toast({ title: "تم إضافة الطبق بنجاح" });
      }
    }

    setOpen(false);
    resetForm();
    fetchDishes();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("dishes").delete().eq("id", id);

    if (error) {
      toast({ variant: "destructive", title: "خطأ في الحذف" });
    } else {
      toast({ title: "تم حذف الطبق بنجاح" });
      fetchDishes();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      name_ar: "",
      description: "",
      description_ar: "",
      price: "",
      image_url: "",
      is_available: true,
    });
    setEditingDish(null);
  };

  const openEditDialog = (dish: Dish) => {
    setEditingDish(dish);
    setFormData({
      name: dish.name,
      name_ar: dish.name_ar || "",
      description: dish.description || "",
      description_ar: dish.description_ar || "",
      price: dish.price.toString(),
      image_url: dish.image_url || "",
      is_available: dish.is_available,
    });
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">إدارة الأطباق</h1>
        <Dialog open={open} onOpenChange={(isOpen) => { setOpen(isOpen); if (!isOpen) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 ml-2" />
              إضافة طبق جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle>{editingDish ? "تعديل الطبق" : "إضافة طبق جديد"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الاسم (English)</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>الاسم (العربية)</Label>
                  <Input
                    value={formData.name_ar}
                    onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الوصف (English)</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>الوصف (العربية)</Label>
                  <Textarea
                    value={formData.description_ar}
                    onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>السعر (دج)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>رابط الصورة</Label>
                <Input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  checked={formData.is_available}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
                />
                <Label>متاح للطلب</Label>
              </div>

              <Button type="submit" className="w-full">
                {editingDish ? "تحديث" : "إضافة"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dishes.map((dish) => (
          <Card key={dish.id}>
            <CardHeader>
              {dish.image_url && (
                <img
                  src={dish.image_url}
                  alt={dish.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <CardTitle className="flex justify-between items-start">
                <span>{dish.name_ar || dish.name}</span>
                <span className="text-primary">{dish.price.toFixed(2)} دج</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4" dir="rtl">
                {dish.description_ar || dish.description}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditDialog(dish)}
                  className="flex-1"
                >
                  <Pencil className="h-4 w-4 ml-2" />
                  تعديل
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(dish.id)}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 ml-2" />
                  حذف
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
