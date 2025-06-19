import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { APP_NAME } from '@/constants';
import LoadingSpinner from '../components/LoadingSpinner';
import { RegisterData } from '@types-shared';
import EyeIcon from '../components/EyeIcon';
import EyeSlashIcon from '../components/EyeSlashIcon';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, isLoading: authIsLoading } = useAuth(); 
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (formData.password !== formData.confirmPassword) {
      setError('Kata sandi tidak cocok.');
      return;
    }
    if (formData.password.length < 6) {
        setError('Kata sandi minimal 6 karakter.');
        return;
    }
    setIsSubmitting(true);
    
    const userDataForLocal: RegisterData = {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password, 
    };

    try {
      await register(userDataForLocal);
      
      navigate('/login'); 

    } catch (err: any) {
      setError(err.message || 'Pendaftaran gagal. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 bg-white p-8 sm:p-10 rounded-xl shadow-lg border border-neutral-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-primary">
            Buat akun {APP_NAME} Anda
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md text-center">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
            <input name="firstName" type="text" value={formData.firstName} onChange={handleChange} required placeholder="Nama Depan" className="input-field" />
            <input name="lastName" type="text" value={formData.lastName} onChange={handleChange} required placeholder="Nama Belakang" className="input-field" />
            <input name="username" type="text" value={formData.username} onChange={handleChange} required placeholder="Nama Pengguna" className="input-field sm:col-span-2" />
            <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="Alamat Email" className="input-field sm:col-span-2" />
            <input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Nomor Telepon (Opsional)" className="input-field sm:col-span-2" />
            
            <div className="flex items-center input-field-container">
              <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} required placeholder="Kata Sandi (min. 6 karakter)" className="input-field-inner flex-grow" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-2 text-neutral-500 hover:text-neutral-700 focus:outline-none"
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
            <div className="flex items-center input-field-container">
              <input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} required placeholder="Konfirmasi Kata Sandi" className="input-field-inner flex-grow" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="p-2 text-neutral-500 hover:text-neutral-700 focus:outline-none"
                aria-label={showConfirmPassword ? "Sembunyikan konfirmasi kata sandi" : "Tampilkan konfirmasi kata sandi"}
              >
                {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <style>{`
            .input-field {
              appearance: none;
              position: relative;
              display: block;
              width: 100%;
              padding: 0.5rem 0.75rem;
              border: 1px solid #D1D5DB; 
              color: #1F2937; 
              border-radius: 0.375rem; 
              background-color: #FFFFFF; 
            }
            .input-field::placeholder {
              color: #6B7280; 
            }
            .input-field:focus {
              outline: none;
              border-color: #EF4444; 
              box-shadow: 0 0 0 1px #EF4444; 
              z-index: 10;
            }
            .input-field-container {
              display: flex;
              align-items: center;
              border: 1px solid #D1D5DB; 
              border-radius: 0.375rem; 
              background-color: #FFFFFF; 
            }
            .input-field-container:focus-within {
              border-color: #EF4444; 
              box-shadow: 0 0 0 1px #EF4444; 
              z-index: 10;
            }
            .input-field-inner {
              appearance: none;
              position: relative;
              display: block;
              width: 100%;
              padding: 0.5rem 0.75rem;
              border: none;
              color: #1F2937; 
              background-color: transparent;
            }
            .input-field-inner::placeholder {
              color: #6B7280; 
            }
            .input-field-inner:focus {
              outline: none;
            }
          `}</style>


          <div>
            <button
              type="submit"
              disabled={isSubmitting || authIsLoading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70"
            >
              {isSubmitting || authIsLoading ? <LoadingSpinner size="h-5 w-5" color="text-white" /> : 'Buat Akun'}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-neutral-600">
          Sudah punya akun?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;