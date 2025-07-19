import { AnimatedText } from "./animated-text";
import { CustomConnectButton } from "./custom-connect-button";
import { cn } from "@/lib/utils";

const navItems = [
    { name: 'HOME', href: '/'},
    { name: 'ECOSYSTEM', href: '/ecosystem'},
    { name: 'TECHNOLOGY', href: '/technology'},
    { name: 'TOOLS', href: '/tools'},
    { name: 'MINT', href: '/mint'},
];

export function Header() {
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
                    <CustomConnectButton />
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
