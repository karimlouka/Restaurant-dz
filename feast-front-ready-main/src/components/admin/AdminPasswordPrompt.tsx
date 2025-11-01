import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AdminPasswordPromptProps {
  onSuccess: () => void;
  correctPassword: string;
}

export default function AdminPasswordPrompt({ onSuccess, correctPassword }: AdminPasswordPromptProps) {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // محاكاة تأخير في التحقق
    setTimeout(() => {
      if (password === correctPassword) {
        toast.success('تم التحقق بنجاح! مرحباً بك في لوحة التحكم');
        setPassword('');
        setAttempts(0);
        onSuccess();
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= maxAttempts) {
          setError(`تم تجاوز عدد المحاولات المسموحة (${maxAttempts}). يرجى المحاولة لاحقاً.`);
          toast.error('تم تجاوز عدد المحاولات المسموحة');
        } else {
          const remainingAttempts = maxAttempts - newAttempts;
          setError(`كلمة المرور غير صحيحة. لديك ${remainingAttempts} محاولات متبقية.`);
          toast.error('كلمة المرور غير صحيحة');
        }
        setPassword('');
      }
      setIsLoading(false);
    }, 500);
  };

  const isBlocked = attempts >= maxAttempts;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <Lock className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">لوحة التحكم الإدارية</CardTitle>
          <CardDescription>أدخل كلمة المرور للوصول إلى لوحة التحكم</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isBlocked || isLoading}
                className="text-lg py-6 border-2 border-slate-200 focus:border-blue-500 focus:ring-0"
                autoFocus
              />
            </div>

            {error && (
              <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isBlocked || isLoading || !password}
              className="w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300"
            >
              {isLoading ? 'جاري التحقق...' : 'دخول'}
            </Button>

            {attempts > 0 && !isBlocked && (
              <div className="text-center text-sm text-slate-600">
                عدد المحاولات المتبقية: <span className="font-bold text-orange-600">{maxAttempts - attempts}</span>
              </div>
            )}

            {isBlocked && (
              <div className="text-center text-sm text-red-600 font-semibold">
                تم حظر الوصول مؤقتاً. يرجى المحاولة لاحقاً.
              </div>
            )}
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 text-center">
              <strong>ملاحظة:</strong> كلمة المرور الافتراضية هي <span className="font-mono bg-blue-100 px-2 py-1 rounded">admin123</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
