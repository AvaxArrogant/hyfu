import { AnimatedText } from "./animated-text";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const navItems = [
    { name: 'HOME', href: '/'},
    { name: 'ECOSYSTEM', href: '/ecosystem'},
    { name: 'TECHNOLOGY', href: '/technology'},
    { name: 'TOOLS', href: '/tools'},
    { name: 'MINT', href: '/mint'},
];

interface HeaderProps {
    isConnected: boolean;
    onConnect: () => void;
}

export function Header({ isConnected, onConnect }: HeaderProps) {
    return (
        <header className="p-4 md:p-8 text-white opacity-0" style={{ animation: 'fade-in 1s ease-out 0.2s forwards' }}>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center">
                    <a href="/" className="inline-block">
                        <AnimatedText
                            text="HYPERFUELED"
                            className="font-headline text-xl md:text-2xl tracking-[0.2em]"
                            triggerOnHover={true}
                        />
                    </a>
                    <Button
                        onClick={onConnect}
                        variant="outline"
                        className={cn(
                            "bg-transparent border-white/50 text-white hover:bg-white/10 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300 text-xs md:text-sm px-2 md:px-4",
                            isConnected && "border-accent/50 bg-accent/10 text-accent shadow-md shadow-accent/50 hover:bg-accent/20 hover:text-accent hover:border-accent"
                        )}
                    >
                        {isConnected ? "Connected" : "Connect Wallet"}
                    </Button>
                </div>
                <div className="h-px w-full bg-white/20 my-4" />
                <nav>
                    <ul className="flex flex-col md:flex-row items-start md:items-center flex-wrap gap-x-6 gap-y-2 md:gap-x-12">
                        {navItems.map((item, index) => (
                            <li key={item.name}>
                                <a href={item.href} className="transition-colors text-white hover:text-accent">
                                    <AnimatedText
                                        text={item.name}
                                        delay={300 + 100 * (index + 1)}
                                        className="font-headline text-sm tracking-widest"
                                        triggerOnHover={true}
                                    />
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
}
