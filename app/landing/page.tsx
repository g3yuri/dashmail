import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Mail, 
  Tags, 
  LayoutDashboard, 
  Archive, 
  Filter, 
  Zap,
  CheckCircle,
  Star,
  ArrowRight
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">DashMail</span>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">
              Ir al Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Gestiona tus correos con
            <span className="text-blue-600 dark:text-blue-400"> inteligencia</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            DashMail combina etiquetas inteligentes, vista Kanban y filtros avanzados 
            para transformar tu bandeja de entrada en un sistema de productividad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-3">
                Comenzar Gratis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              Ver Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Funcionalidades Principales
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Todo lo que necesitas para mantener tu email organizado y ser más productivo
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <Tags className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Etiquetas Inteligentes</CardTitle>
              <CardDescription>
                Organiza automáticamente tus correos con etiquetas personalizables y filtros avanzados
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <LayoutDashboard className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Vista Kanban</CardTitle>
              <CardDescription>
                Gestiona el estado de tus emails como tareas con drag & drop entre columnas
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <Filter className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Filtros Avanzados</CardTitle>
              <CardDescription>
                Usa sintaxis filtrex o descripciones en lenguaje natural para filtrar correos
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                <Archive className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle>Archivo Inteligente</CardTitle>
              <CardDescription>
                Archiva correos con un clic y mantén tu bandeja limpia y organizada
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle>Tiempo Real</CardTitle>
              <CardDescription>
                Persistencia local automática y sincronización instantánea de cambios
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <CardTitle>Diseño Moderno</CardTitle>
              <CardDescription>
                Interfaz limpia, responsive y con soporte completo para modo oscuro
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                ¿Por qué elegir DashMail?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Zero configuración</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Comienza a usar inmediatamente sin instalaciones complejas
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Totalmente gratuito</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Sin límites, sin suscripciones, sin costos ocultos
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Privacidad total</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Todos tus datos se almacenan localmente en tu navegador
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Multiplataforma</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Funciona en cualquier dispositivo con navegador web
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">¿Listo para comenzar?</h3>
                <p className="mb-6 opacity-90">
                  Transforma tu gestión de correos hoy mismo con DashMail
                </p>
                <Link href="/dashboard">
                  <Button variant="secondary" size="lg" className="w-full">
                    Acceder al Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">DashMail</span>
          </div>
          <p className="text-gray-400 mb-4">
            Gestión inteligente de correos electrónicos
          </p>
          <p className="text-sm text-gray-500">
            Construido con Next.js, Tailwind CSS y ShadCN
          </p>
        </div>
      </footer>
    </div>
  );
} 