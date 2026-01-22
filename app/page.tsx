import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-16">
        {/* Hero Section */}
        <div className="space-y-8 text-center">
          <h1 className="display-large tracking-tight">
            Nexus
          </h1>

          <Separator className="max-w-xs mx-auto" />

          <p className="text-2xl md:text-3xl font-light max-w-2xl mx-auto leading-relaxed">
            La première plateforme d'automatisation desktop basée sur l'IA qui transforme vos instructions en actions concrètes.
          </p>
        </div>

        {/* Value Proposition */}
        <div className="space-y-6 max-w-2xl mx-auto">
          <p className="text-lg leading-relaxed">
            Au lieu de configurer des workflows complexes ou d'écrire du code,
            vous décrivez simplement votre besoin en langage naturel.
            Notre IA comprend le contexte visuel de votre écran pour exécuter
            les tâches automatiquement.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-6">
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-12 py-6 h-auto">
              Lancer l'application
            </Button>
          </Link>

          <p className="text-sm text-muted-foreground">
            Version Alpha — Alimenté par Claude AI
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 pt-16">
          <div className="space-y-3">
            <h3 className="font-bold text-xl">Langage Naturel</h3>
            <p className="text-base leading-relaxed text-muted-foreground">
              Décrivez vos tâches en français, sans syntaxe complexe.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-xl">Vision IA</h3>
            <p className="text-base leading-relaxed text-muted-foreground">
              Analyse visuelle de votre écran en temps réel.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-xl">Automatisation</h3>
            <p className="text-base leading-relaxed text-muted-foreground">
              Exécution autonome de vos workflows desktop.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
