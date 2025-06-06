"use client";

import { useEffect, useRef } from 'react';
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
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrar el plugin de ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const heroRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const benefitsRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animación del header
      gsap.fromTo(headerRef.current, 
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );

      // Animación del hero
      if (heroRef.current) {
        const heroTl = gsap.timeline();
        const h1 = heroRef.current.querySelector('h1');
        const p = heroRef.current.querySelector('p');
        const buttons = heroRef.current.querySelector('.hero-buttons');
        
        if (h1) {
          heroTl.fromTo(h1, 
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
          );
        }
        if (p) {
          heroTl.fromTo(p, 
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
            "-=0.8"
          );
        }
        if (buttons) {
          heroTl.fromTo(buttons, 
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
            "-=0.6"
          );
        }
      }

      // Animación de las cards de features
      if (featuresRef.current) {
        const featureCards = featuresRef.current.querySelectorAll('.feature-card');
        if (featureCards.length > 0) {
          gsap.fromTo(featureCards,
            { y: 100, opacity: 0, scale: 0.8 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.2,
              scrollTrigger: {
                trigger: featuresRef.current,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }
      }

      // Animación de los beneficios
      if (benefitsRef.current) {
        const benefitItems = benefitsRef.current.querySelectorAll('.benefit-item');
        if (benefitItems.length > 0) {
          gsap.fromTo(benefitItems,
            { x: -100, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.15,
              scrollTrigger: {
                trigger: benefitsRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }

        // Animación del CTA
        const ctaCard = benefitsRef.current.querySelector('.cta-card');
        if (ctaCard) {
          gsap.fromTo(ctaCard,
            { x: 100, opacity: 0, scale: 0.9 },
            {
              x: 0,
              opacity: 1,
              scale: 1,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ctaCard,
                start: "top 80%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }
      }

      // Animación del footer
      gsap.fromTo(footerRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Animación de hover para las cards
      const cards = document.querySelectorAll('.hover-card');
      cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, { scale: 1.05, duration: 0.3, ease: "power2.out" });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { scale: 1, duration: 0.3, ease: "power2.out" });
        });
      });

      // Animación de floating para los iconos
      gsap.to('.floating-icon', {
        y: -10,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.3
      });

    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Header */}
      <header ref={headerRef} className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center floating-icon">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">DashMail</span>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" className="hover-card">
              Ir al Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Gestiona tus correos con
            <span className="text-blue-600 dark:text-blue-400"> inteligencia</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            DashMail combina etiquetas inteligentes, vista Kanban y filtros avanzados 
            para transformar tu bandeja de entrada en un sistema de productividad.
          </p>
          <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-3 hover-card">
                Comenzar Gratis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3 hover-card">
              Ver Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Funcionalidades Principales
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Todo lo que necesitas para mantener tu email organizado y ser más productivo
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="feature-card hover-card hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 floating-icon">
                <Tags className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Etiquetas Inteligentes</CardTitle>
              <CardDescription>
                Organiza automáticamente tus correos con etiquetas personalizables y filtros avanzados
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="feature-card hover-card hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4 floating-icon">
                <LayoutDashboard className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Vista Kanban</CardTitle>
              <CardDescription>
                Gestiona el estado de tus emails como tareas con drag & drop entre columnas
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="feature-card hover-card hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 floating-icon">
                <Filter className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Filtros Avanzados</CardTitle>
              <CardDescription>
                Usa sintaxis filtrex o descripciones en lenguaje natural para filtrar correos
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="feature-card hover-card hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4 floating-icon">
                <Archive className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle>Archivo Inteligente</CardTitle>
              <CardDescription>
                Archiva correos con un clic y mantén tu bandeja limpia y organizada
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="feature-card hover-card hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4 floating-icon">
                <Zap className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle>Tiempo Real</CardTitle>
              <CardDescription>
                Persistencia en base de datos y sincronización instantánea de cambios
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="feature-card hover-card hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4 floating-icon">
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
      <section ref={benefitsRef} className="bg-white dark:bg-gray-800 py-16">
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
                  <div className="benefit-item flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Zero configuración</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Comienza a usar inmediatamente sin instalaciones complejas
                      </p>
                    </div>
                  </div>

                  <div className="benefit-item flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Gestión profesional</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Base de datos robusta con autenticación y seguridad por usuario
                      </p>
                    </div>
                  </div>

                  <div className="benefit-item flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Privacidad garantizada</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Tus datos están seguros con autenticación de Clerk y base de datos aislada
                      </p>
                    </div>
                  </div>

                  <div className="benefit-item flex items-start space-x-3">
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

              <div className="cta-card bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white hover-card">
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
      <footer ref={footerRef} className="bg-gray-900 dark:bg-black text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center floating-icon">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">DashMail</span>
          </div>
          <p className="text-gray-400 mb-4">
            Gestión inteligente de correos electrónicos
          </p>
          <p className="text-sm text-gray-500">
            Construido con Next.js, Tailwind CSS, ShadCN, Drizzle y GSAP
          </p>
        </div>
      </footer>
    </div>
  );
} 