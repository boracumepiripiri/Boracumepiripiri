import { useState, useMemo } from "react";
import pastaRealImg from "../assets/pasta-real.png";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { MapPin, MessageCircle, Instagram, UtensilsCrossed, ChefHat, Check, AlertCircle, Bike, Store, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const TAMANHOS = [
  { id: "p", name: "Tamanho P", price: "R$ 12,00", value: 12 },
  { id: "m", name: "Tamanho M", price: "R$ 15,00", value: 15 },
  { id: "g", name: "Tamanho G", price: "R$ 17,00", value: 17 },
];

const TAXA_DELIVERY = 5;

const formatBRL = (n: number) =>
  `R$ ${n.toFixed(2).replace(".", ",")}`;

const MACARROES = [
  { id: "espaguete", name: "Macarrão Espaguete", desc: "O clássico longo" },
  { id: "penne", name: "Macarrão Penne", desc: "Tubinhos perfeitos" },
];

const MOLHOS = [
  { id: "branco_cremoso", name: "Molho Branco Cremoso", desc: "Cremoso e suave" },
  { id: "bolonhesa", name: "Molho à Bolonhesa", desc: "Tradicional com carne" },
];

const PROTEINAS = [
  { id: "frango_desfiado", name: "Frango Desfiado" },
  { id: "bacon", name: "Bacon" },
  { id: "calabresa", name: "Calabresa" },
  { id: "camarao", name: "Camarão" },
];

const ADICIONAIS = [
  { id: "batata_palha", name: "Batata Palha" },
  { id: "presunto", name: "Presunto" },
  { id: "queijo_extra", name: "Queijo Extra" },
  { id: "milho_verde", name: "Milho Verde" },
  { id: "azeitona", name: "Azeitona" },
  { id: "ervilha", name: "Ervilha" },
];

const CALDOS = [
  {
    id: "caldo_macaxeira",
    name: "Caldo de Macaxeira",
    ingredientes: "Calabresa, cheiro verde e adicionais",
    price: "R$ 15,00",
    value: 15,
  },
];

const BEBIDAS = [
  { id: "coca_350", name: "Coca-Cola 350ml", price: "R$ 6,00", value: 6 },
];

export default function Home() {
  const [macarrao, setMacarrao] = useState<string | null>(null);
  const [molho, setMolho] = useState<string | null>(null);
  const [proteinas, setProteinas] = useState<string[]>([]);
  const [adicionais, setAdicionais] = useState<string[]>([]);
  const [observacoes, setObservacoes] = useState("");
  const [pagamento, setPagamento] = useState<string | null>(null);
  const [tamanho, setTamanho] = useState<string | null>(null);
  const [entrega, setEntrega] = useState<"retirada" | "delivery" | null>(null);
  const [nome, setNome] = useState("");
  const [bairro, setBairro] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [referencia, setReferencia] = useState("");

  const toggleProteina = (id: string) => {
    setProteinas((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleAdicional = (id: string) => {
    setAdicionais((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const [caldos, setCaldos] = useState<string[]>([]);
  const toggleCaldo = (id: string) => {
    setCaldos((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const [bebidas, setBebidas] = useState<string[]>([]);
  const toggleBebida = (id: string) => {
    setBebidas((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const scrollToBuilder = () => {
    document.getElementById("pedido")?.scrollIntoView({ behavior: "smooth" });
  };

  const PAGAMENTOS = [
    { id: "pix", name: "Pix" },
    { id: "dinheiro", name: "Dinheiro" },
    { id: "cartao", name: "Cartão" },
  ];

  const tamanhoSel = TAMANHOS.find((x) => x.id === tamanho);
  const valorTamanho = (macarrao && tamanhoSel) ? tamanhoSel.value : 0;
  const valorEntrega = entrega === "delivery" ? TAXA_DELIVERY : 0;
  const proteinasExtras = Math.max(0, proteinas.length - 1);
  const valorProteinasExtras = proteinasExtras * 5;
  const valorCaldos = caldos.reduce((sum, id) => sum + (CALDOS.find(c => c.id === id)?.value ?? 0), 0);
  const valorBebidas = bebidas.reduce((sum, id) => sum + (BEBIDAS.find(b => b.id === id)?.value ?? 0), 0);
  const valorTotal = valorTamanho + valorEntrega + valorProteinasExtras + valorCaldos + valorBebidas;

  const enderecoCompleto =
    entrega === "delivery" &&
    bairro.trim() !== "" &&
    rua.trim() !== "" &&
    numero.trim() !== "";

  const orderingPasta = tamanho !== null || macarrao !== null || molho !== null;
  const pastaValid = !orderingPasta || (tamanho !== null && macarrao !== null && molho !== null);
  const hasItems = (tamanho !== null && macarrao !== null && molho !== null) || caldos.length > 0 || bebidas.length > 0;

  const canSubmit =
    nome.trim() !== "" &&
    hasItems &&
    pastaValid &&
    pagamento !== null &&
    (entrega === "retirada" || enderecoCompleto);

  const whatsappMessage = useMemo(() => {
    if (!canSubmit) return "";

    const t = TAMANHOS.find((x) => x.id === tamanho);
    const m = MACARROES.find((x) => x.id === macarrao)?.name;
    const mo = MOLHOS.find((x) => x.id === molho)?.name;
    const p = proteinas.map((id) => PROTEINAS.find((x) => x.id === id)?.name).join(", ");
    const a = adicionais.map((id) => ADICIONAIS.find((x) => x.id === id)?.name).join(", ");

    let text = `Olá, BoraCumê! Gostaria de fazer um pedido:\n\n`;
    text += `🍝 *Nome:* ${nome.trim()}\n`;
    if (macarrao) {
      if (t) text += `🍝 *Tamanho:* ${t.name} - ${t.price}\n`;
      text += `🍝 *Massa:* ${m}\n`;
      text += `🍝 *Molho:* ${mo}\n`;
      if (p) {
        text += `🍝 *Proteínas:* ${p}`;
        if (proteinasExtras > 0) {
          text += ` (+ ${formatBRL(valorProteinasExtras)} por ${proteinasExtras} proteína${proteinasExtras > 1 ? "s" : ""} extra${proteinasExtras > 1 ? "s" : ""})`;
        }
        text += `\n`;
      }
      if (a) text += `🍝 *Adicionais:* ${a}\n`;
    }

    if (caldos.length > 0) {
      const c = caldos.map((id) => CALDOS.find((x) => x.id === id)?.name).join(", ");
      text += `🍝 *Caldos:* ${c}\n`;
    }

    if (bebidas.length > 0) {
      const b = bebidas.map((id) => BEBIDAS.find((x) => x.id === id)?.name).join(", ");
      text += `🍝 *Bebidas:* ${b}\n`;
    }

    const pg = PAGAMENTOS.find((x) => x.id === pagamento)?.name;
    if (pg) text += `🍝 *Pagamento:* ${pg}\n`;

    if (entrega === "retirada") {
      text += `\n🍝 *Retirada no local:*\nPlanalto Petecas, Quadra W1, Casa 11\n`;
    } else if (entrega === "delivery") {
      text += `\n🍝 *Entrega (Delivery):*\n`;
      text += `Bairro: ${bairro}\n`;
      text += `Rua: ${rua}\n`;
      text += `Número: ${numero}\n`;
      if (referencia.trim()) text += `Referência: ${referencia}\n`;
      text += `Taxa de entrega: ${formatBRL(TAXA_DELIVERY)}\n`;
    }

    if (observacoes) text += `\n🍝 *Observações:* ${observacoes}\n`;

    text += `\n🍝 *Total: ${formatBRL(valorTotal)}*`;

    return encodeURIComponent(text);
  }, [nome, tamanho, macarrao, molho, proteinas, adicionais, caldos, bebidas, observacoes, pagamento, entrega, bairro, rua, numero, referencia, canSubmit, valorTotal, valorProteinasExtras, proteinasExtras, valorCaldos, valorBebidas]);

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans bg-background selection:bg-primary/20">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <UtensilsCrossed className="h-6 w-6" />
            <span className="font-serif font-bold text-2xl tracking-tight">BoraCumê</span>
          </div>
          <Button variant="ghost" size="sm" className="hidden md:flex gap-2 text-foreground font-medium" onClick={scrollToBuilder}>
            Fazer Pedido
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 lg:pt-24 lg:pb-32 overflow-hidden">
        {/* Background image with elegant overlay */}
        <img
          src={pastaRealImg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
          style={{ zIndex: 0 }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: "rgba(253, 248, 242, 0.82)", zIndex: 1 }}
        />

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary-foreground text-sm font-medium mb-6 border border-secondary/30">
            <MapPin className="h-4 w-4 text-primary" />
            Piripiri • Macarrão cremoso do seu jeito
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-foreground max-w-4xl leading-[1.1] mb-6">
            O macarrão mais <span className="text-primary italic">cremoso</span> da cidade.
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
            Bateu à fome? Monte seu macarrão do jeito que você gosta. E receba uma explosão de sabores!
          </p>

          <Button size="xl" className="rounded-full text-lg px-8 py-6 shadow-xl shadow-primary/20 hover:scale-105 transition-transform" onClick={scrollToBuilder}>
            Montar meu pedido
          </Button>

          <div className="mt-8 inline-flex items-center gap-3 px-5 py-3 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Clock className="h-5 w-5" />
            <span className="font-bold text-base md:text-lg tracking-tight">
              Aberto de Segunda a Sábado · 12h às 20h
            </span>
          </div>
        </div>

        {/* Decorative background blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      </section>

      {/* Builder Section */}
      <section id="pedido" className="py-24 bg-card border-y border-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Monte do seu jeito</h2>
            <p className="text-muted-foreground text-lg">Escolha sua massa, seu molho e capriche nos acompanhamentos.</p>
          </div>

          <div className="grid lg:grid-cols-[1fr_350px] gap-12">
            
            {/* Options */}
            <div className="space-y-12">
              
              {/* Passo 1: Seu nome */}
              <div className="space-y-6">
                <div className="flex items-baseline gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg",
                    nome.trim() ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20 text-muted-foreground"
                  )}>1</div>
                  <h3 className="font-serif text-2xl font-bold text-foreground">Seu nome</h3>
                  <span className="text-sm text-destructive font-medium ml-auto">Obrigatório</span>
                </div>
                <Input
                  placeholder="Como podemos te chamar?"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="rounded-xl h-12 text-base"
                />
              </div>

              {/* Passo 2: Tamanho */}
              <div className="space-y-6">
                <div className="flex items-baseline gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg",
                    tamanho ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20 text-muted-foreground"
                  )}>2</div>
                  <h3 className="font-serif text-2xl font-bold text-foreground">Escolha o Tamanho</h3>
                  <span className="text-sm text-muted-foreground ml-auto">Para macarrão</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {TAMANHOS.map((t) => {
                    const isSelected = tamanho === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setTamanho(t.id)}
                        className={cn(
                          "relative flex flex-col items-start text-left p-5 rounded-2xl border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                          isSelected
                            ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                            : "border-border bg-background hover:border-primary/30 hover:bg-muted/50"
                        )}
                      >
                        <span className="font-bold text-foreground text-lg mb-1">{t.name}</span>
                        <span className="text-primary font-bold">{t.price}</span>
                        {isSelected && <Check className="h-5 w-5 text-primary absolute top-3 right-3" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Passo 3: Massa */}
              <div className="space-y-6">
                <div className="flex items-baseline gap-3">
                  <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">3</div>
                  <h3 className="font-serif text-2xl font-bold text-foreground">Escolha a Massa</h3>
                  <span className="text-sm text-muted-foreground ml-auto">Para macarrão</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {MACARROES.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMacarrao(m.id)}
                      className={cn(
                        "flex flex-col text-left p-4 rounded-2xl border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        macarrao === m.id 
                          ? "border-primary bg-primary/5 shadow-md scale-[1.02]" 
                          : "border-border bg-background hover:border-primary/30 hover:bg-muted/50"
                      )}
                    >
                      <span className="font-bold text-foreground mb-1">{m.name}</span>
                      <span className="text-xs text-muted-foreground leading-tight">{m.desc}</span>
                      {macarrao === m.id && <Check className="h-5 w-5 text-primary absolute top-3 right-3" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Passo 4: Molho */}
              <div className="space-y-6">
                <div className="flex items-baseline gap-3">
                  <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">4</div>
                  <h3 className="font-serif text-2xl font-bold text-foreground">Escolha o Molho</h3>
                  <span className="text-sm text-muted-foreground ml-auto">Para macarrão</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {MOLHOS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMolho(m.id)}
                      className={cn(
                        "flex flex-col text-left p-4 rounded-2xl border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        molho === m.id 
                          ? "border-secondary bg-secondary/10 shadow-md scale-[1.02]" 
                          : "border-border bg-background hover:border-secondary/30 hover:bg-muted/50"
                      )}
                    >
                      <span className="font-bold text-foreground mb-1 text-lg">{m.name}</span>
                      <span className="text-sm text-muted-foreground">{m.desc}</span>
                      {molho === m.id && <Check className="h-5 w-5 text-secondary absolute top-4 right-4" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Passo 5: Proteínas */}
              <div className="space-y-6">
                <div className="flex items-baseline gap-3">
                  <div className="bg-muted-foreground/20 text-muted-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">5</div>
                  <h3 className="font-serif text-2xl font-bold text-foreground">Proteínas</h3>
                  <span className="text-sm text-muted-foreground ml-auto">Opcional</span>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-lg border border-primary/30 bg-primary/5 text-sm text-foreground">
                  <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>A primeira proteína está incluída. Cada proteína adicional custa <strong>+ R$ 5,00</strong>.</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {PROTEINAS.map((p) => {
                    const isSelected = proteinas.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={() => toggleProteina(p.id)}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          isSelected 
                            ? "border-primary/50 bg-primary/5" 
                            : "border-border bg-background hover:bg-muted/50"
                        )}
                      >
                        <div className={cn(
                          "w-5 h-5 rounded flex items-center justify-center border",
                          isSelected ? "bg-primary border-primary" : "border-input bg-background"
                        )}>
                          {isSelected && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                        </div>
                        <span className={cn("font-medium text-sm", isSelected ? "text-foreground" : "text-muted-foreground")}>{p.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Passo 6: Adicionais */}
              <div className="space-y-6">
                <div className="flex items-baseline gap-3">
                  <div className="bg-muted-foreground/20 text-muted-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">6</div>
                  <h3 className="font-serif text-2xl font-bold text-foreground">Adicionais</h3>
                  <span className="text-sm text-muted-foreground ml-auto">Opcional</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {ADICIONAIS.map((a) => {
                    const isSelected = adicionais.includes(a.id);
                    return (
                      <button
                        key={a.id}
                        onClick={() => toggleAdicional(a.id)}
                        className={cn(
                          "px-4 py-2 rounded-full border transition-all duration-200 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          isSelected 
                            ? "border-secondary bg-secondary/20 text-foreground" 
                            : "border-border bg-background text-muted-foreground hover:bg-muted/50"
                        )}
                      >
                        {a.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Passo 7: Caldos */}
              <div className="space-y-6">
                <div className="flex items-baseline gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg",
                    caldos.length > 0 ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20 text-muted-foreground"
                  )}>7</div>
                  <h3 className="font-serif text-2xl font-bold text-foreground">Caldos</h3>
                  <span className="text-sm text-muted-foreground ml-auto">Opcional</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {CALDOS.map((c) => {
                    const isSelected = caldos.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => toggleCaldo(c.id)}
                        className={cn(
                          "relative flex flex-col items-start text-left p-5 rounded-2xl border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          isSelected
                            ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                            : "border-border bg-background hover:border-primary/30 hover:bg-muted/50"
                        )}
                      >
                        <div className="flex items-start justify-between w-full mb-2">
                          <span className="font-bold text-foreground text-lg">{c.name}</span>
                          {isSelected && <Check className="h-5 w-5 text-primary shrink-0 ml-2" />}
                        </div>
                        <span className="text-sm text-muted-foreground mb-3">{c.ingredientes}</span>
                        <span className="text-primary font-bold">{c.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Passo 8: Bebidas */}
              <div className="space-y-6">
                <div className="flex items-baseline gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg",
                    bebidas.length > 0 ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20 text-muted-foreground"
                  )}>8</div>
                  <h3 className="font-serif text-2xl font-bold text-foreground">Bebidas</h3>
                  <span className="text-sm text-muted-foreground ml-auto">Opcional</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {BEBIDAS.map((b) => {
                    const isSelected = bebidas.includes(b.id);
                    return (
                      <button
                        key={b.id}
                        onClick={() => toggleBebida(b.id)}
                        className={cn(
                          "relative flex flex-col items-start text-left p-5 rounded-2xl border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          isSelected
                            ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                            : "border-border bg-background hover:border-primary/30 hover:bg-muted/50"
                        )}
                      >
                        <div className="flex items-start justify-between w-full mb-2">
                          <span className="font-bold text-foreground text-lg">{b.name}</span>
                          {isSelected && <Check className="h-5 w-5 text-primary shrink-0 ml-2" />}
                        </div>
                        <span className="text-primary font-bold">{b.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Passo 9: Observações */}
              <div className="space-y-6">
                <div className="flex items-baseline gap-3">
                  <div className="bg-muted-foreground/20 text-muted-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">9</div>
                  <h3 className="font-serif text-2xl font-bold text-foreground">Observações</h3>
                  <span className="text-sm text-muted-foreground ml-auto">Opcional</span>
                </div>
                <Textarea 
                  placeholder="Ex: sem cebola, caprichar no queijo, enviar talheres..." 
                  className="min-h-[120px] rounded-2xl resize-none text-base"
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                />
              </div>

              {/* Passo 10: Forma de Pagamento */}
              <div className="space-y-6">
                <div className="flex items-baseline gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg",
                    pagamento ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20 text-muted-foreground"
                  )}>10</div>
                  <h3 className="font-serif text-2xl font-bold text-foreground">Forma de pagamento</h3>
                  <span className="text-sm text-destructive font-medium ml-auto">Obrigatório</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {PAGAMENTOS.map((pg) => {
                    const isSelected = pagamento === pg.id;
                    return (
                      <button
                        key={pg.id}
                        onClick={() => setPagamento(pg.id)}
                        className={cn(
                          "flex items-center justify-center gap-3 p-4 rounded-xl border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border bg-background hover:bg-muted/50"
                        )}
                      >
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center border",
                          isSelected ? "bg-primary border-primary" : "border-input bg-background"
                        )}>
                          {isSelected && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                        </div>
                        <span className={cn("font-medium", isSelected ? "text-foreground" : "text-muted-foreground")}>{pg.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Passo 11: Entrega ou Retirada */}
              <div className="space-y-6">
                <div className="flex items-baseline gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg",
                    entrega ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20 text-muted-foreground"
                  )}>11</div>
                  <h3 className="font-serif text-2xl font-bold text-foreground">Retirada ou Delivery</h3>
                  <span className="text-sm text-destructive font-medium ml-auto">Obrigatório</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setEntrega("retirada")}
                    className={cn(
                      "flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      entrega === "retirada"
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border bg-background hover:border-primary/30 hover:bg-muted/50"
                    )}
                  >
                    <Store className={cn("h-7 w-7 shrink-0", entrega === "retirada" ? "text-primary" : "text-muted-foreground")} />
                    <div>
                      <p className="font-bold text-foreground">Retirar no local</p>
                      <p className="text-sm text-muted-foreground">Você busca quentinho</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setEntrega("delivery")}
                    className={cn(
                      "flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      entrega === "delivery"
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border bg-background hover:border-primary/30 hover:bg-muted/50"
                    )}
                  >
                    <Bike className={cn("h-7 w-7 shrink-0", entrega === "delivery" ? "text-primary" : "text-muted-foreground")} />
                    <div>
                      <p className="font-bold text-foreground">Delivery</p>
                      <p className="text-sm text-muted-foreground">Entregamos na sua porta</p>
                    </div>
                  </button>
                </div>

                {entrega === "retirada" && (
                  <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
                    <p className="text-xs uppercase tracking-wider font-bold text-primary mb-2">Endereço para retirada</p>
                    <p className="font-medium text-foreground leading-relaxed">
                      Planalto Petecas, Quadra W1, Casa 11
                    </p>
                  </div>
                )}

                {entrega === "delivery" && (
                  <div className="rounded-2xl border border-border bg-background p-5 space-y-4">
                    <p className="text-sm font-medium text-foreground">Informe o endereço de entrega:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        placeholder="Bairro"
                        value={bairro}
                        onChange={(e) => setBairro(e.target.value)}
                        className="rounded-xl"
                      />
                      <Input
                        placeholder="Rua"
                        value={rua}
                        onChange={(e) => setRua(e.target.value)}
                        className="rounded-xl"
                      />
                      <Input
                        placeholder="Número"
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                        className="rounded-xl"
                      />
                      <Input
                        placeholder="Ponto de referência"
                        value={referencia}
                        onChange={(e) => setReferencia(e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Sidebar / Resumo */}
            <div className="lg:sticky lg:top-24 h-fit">
              <Card className="rounded-3xl border-border/60 shadow-lg overflow-hidden">
                <div className="bg-primary/10 p-6 border-b border-border/40">
                  <h4 className="font-serif text-2xl font-bold text-foreground flex items-center gap-2">
                    <ChefHat className="h-6 w-6 text-primary" />
                    Seu Pedido
                  </h4>
                </div>
                <CardContent className="p-6">
                  
                  <div className="space-y-4 mb-8">
                    {!nome.trim() && !tamanho && !macarrao && !molho && (
                      <div className="text-center py-8 text-muted-foreground">
                        <UtensilsCrossed className="h-10 w-10 mx-auto mb-3 opacity-20" />
                        <p>Comece informando seu nome e escolhendo o tamanho.</p>
                      </div>
                    )}

                    {nome.trim() && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Nome</p>
                        <p className="font-medium text-foreground">{nome.trim()}</p>
                      </div>
                    )}

                    {tamanho && macarrao && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Tamanho</p>
                        <p className="font-medium text-foreground">
                          {TAMANHOS.find(t => t.id === tamanho)?.name}
                          <span className="text-primary font-bold ml-2">{TAMANHOS.find(t => t.id === tamanho)?.price}</span>
                        </p>
                      </div>
                    )}

                    {macarrao && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Massa</p>
                        <p className="font-medium text-foreground">{MACARROES.find(m => m.id === macarrao)?.name}</p>
                      </div>
                    )}

                    {molho && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Molho</p>
                        <p className="font-medium text-foreground">{MOLHOS.find(m => m.id === molho)?.name}</p>
                      </div>
                    )}

                    {proteinas.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Proteínas</p>
                        <p className="text-foreground text-sm leading-relaxed">
                          {proteinas.map(p => PROTEINAS.find(x => x.id === p)?.name).join(", ")}
                        </p>
                      </div>
                    )}

                    {adicionais.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Adicionais</p>
                        <p className="text-foreground text-sm leading-relaxed">
                          {adicionais.map(a => ADICIONAIS.find(x => x.id === a)?.name).join(", ")}
                        </p>
                      </div>
                    )}

                    {caldos.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Caldos</p>
                        {caldos.map(id => {
                          const c = CALDOS.find(x => x.id === id);
                          return c ? (
                            <p key={id} className="text-foreground text-sm leading-relaxed">
                              {c.name} — <span className="text-primary font-medium">{c.price}</span>
                            </p>
                          ) : null;
                        })}
                      </div>
                    )}

                    {bebidas.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Bebidas</p>
                        {bebidas.map(id => {
                          const b = BEBIDAS.find(x => x.id === id);
                          return b ? (
                            <p key={id} className="text-foreground text-sm leading-relaxed">
                              {b.name} — <span className="text-primary font-medium">{b.price}</span>
                            </p>
                          ) : null;
                        })}
                      </div>
                    )}

                    {pagamento && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Pagamento</p>
                        <p className="font-medium text-foreground">{PAGAMENTOS.find(p => p.id === pagamento)?.name}</p>
                      </div>
                    )}

                    {entrega === "retirada" && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Retirada</p>
                        <p className="font-medium text-foreground text-sm leading-relaxed">Planalto Petecas, Quadra W1, Casa 11</p>
                      </div>
                    )}

                    {entrega === "delivery" && (bairro || rua || numero || referencia) && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Delivery</p>
                        <p className="font-medium text-foreground text-sm leading-relaxed">
                          {[rua, numero].filter(Boolean).join(", ")}
                          {bairro && <> — {bairro}</>}
                          {referencia && <><br /><span className="text-muted-foreground">Ref: {referencia}</span></>}
                        </p>
                      </div>
                    )}
                  </div>

                  {tamanho && (
                    <div className="rounded-2xl bg-muted/40 p-4 mb-6 space-y-2 text-sm">
                      <div className="flex items-center justify-between text-foreground">
                        <span>Subtotal ({tamanhoSel?.name})</span>
                        <span className="font-medium">{formatBRL(valorTamanho)}</span>
                      </div>
                      {proteinasExtras > 0 && (
                        <div className="flex items-center justify-between text-foreground">
                          <span>Proteína{proteinasExtras > 1 ? "s" : ""} extra{proteinasExtras > 1 ? "s" : ""} ({proteinasExtras})</span>
                          <span className="font-medium">+ {formatBRL(valorProteinasExtras)}</span>
                        </div>
                      )}
                      {valorCaldos > 0 && (
                        <div className="flex items-center justify-between text-foreground">
                          <span>Caldos</span>
                          <span className="font-medium">+ {formatBRL(valorCaldos)}</span>
                        </div>
                      )}
                      {valorBebidas > 0 && (
                        <div className="flex items-center justify-between text-foreground">
                          <span>Bebidas</span>
                          <span className="font-medium">+ {formatBRL(valorBebidas)}</span>
                        </div>
                      )}
                      {entrega === "delivery" && (
                        <div className="flex items-center justify-between text-foreground">
                          <span>Taxa de entrega</span>
                          <span className="font-medium">+ {formatBRL(TAXA_DELIVERY)}</span>
                        </div>
                      )}
                      <Separator className="my-2" />
                      <div className="flex items-baseline justify-between">
                        <span className="font-bold text-foreground">Total</span>
                        <span className="font-serif font-bold text-2xl text-primary">{formatBRL(valorTotal)}</span>
                      </div>
                    </div>
                  )}

                  <Separator className="my-6" />

                  {canSubmit ? (
                    <Button 
                      size="xl" 
                      className="w-full rounded-2xl text-lg font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg shadow-[#25D366]/20 transition-all hover:scale-[1.02]"
                      asChild
                    >
                      <a href={`https://wa.me/5586998201570?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="mr-2 h-5 w-5" />
                        Pedir no WhatsApp
                      </a>
                    </Button>
                  ) : (
                    <div className="bg-muted p-4 rounded-2xl flex items-start gap-3 text-muted-foreground text-sm">
                      <AlertCircle className="h-5 w-5 shrink-0 text-primary/60" />
                      <p>Selecione a massa, o molho e a forma de pagamento para liberar o pedido.</p>
                    </div>
                  )}

                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 overflow-hidden relative">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">Feito com muito amor em Piripiri.</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Acreditamos que comida boa abraça a gente por dentro. O BoraCumê nasceu da vontade de oferecer aquele macarrão caseiro, super cremoso e farto, do jeitinho que todo mundo gosta.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Sem frescura, só sabor. Você monta, a gente prepara na hora e entrega quentinho na sua casa.
              </p>
            </div>
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-0 bg-secondary/20 rounded-[2rem] transform translate-x-4 translate-y-4 -z-10" />
                <img 
                  src="/images/about-pasta.png" 
                  alt="Preparando macarrão com amor" 
                  className="rounded-[2rem] shadow-xl w-full max-w-md mx-auto object-cover aspect-[3/4]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-16">
        <div className="container mx-auto px-4 max-w-5xl flex flex-col items-center text-center">
          <div className="flex items-center gap-2 text-primary mb-8">
            <UtensilsCrossed className="h-8 w-8" />
            <span className="font-serif font-bold text-3xl tracking-tight">BoraCumê</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <a href="https://wa.me/5586998201570" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium">
              <MessageCircle className="h-5 w-5 text-[#25D366]" />
              (86) 99820-1570
            </a>
            <a href="https://instagram.com/boracumepiripiri" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium">
              <Instagram className="h-5 w-5 text-[#E1306C]" />
              @boracumepiripiri
            </a>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <MapPin className="h-5 w-5 text-primary" />
              Piripiri, PI
            </div>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Clock className="h-5 w-5 text-primary" />
              Seg a Sáb · 12h às 20h
            </div>
          </div>

          <div className="text-muted-foreground text-sm">
            <p>© 2026 BoraCumê - Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
