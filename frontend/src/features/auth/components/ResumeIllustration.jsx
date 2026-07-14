const SKILL_NODES = [
    { id: 1, label: 'React',      x: '10%', y: '16%', delay: '0s'   },
    { id: 2, label: 'Python',     x: '72%', y: '11%', delay: '0.9s' },
    { id: 3, label: 'SQL',        x: '84%', y: '50%', delay: '1.7s' },
    { id: 4, label: 'Node.js',    x: '68%', y: '83%', delay: '2.5s' },
    { id: 5, label: 'TypeScript', x: '6%',  y: '74%', delay: '3.3s' },
    { id: 6, label: 'AWS',        x: '4%',  y: '44%', delay: '4.1s' },
];

const TAGLINES = {
    login: (
        <>
            AI-powered analysis that reveals
            <br />
            <span className="text-primary">the story behind your resume.</span>
        </>
    ),
    register: (
        <>
            Join thousands making smarter
            <br />
            <span className="text-primary">career decisions with AI insight.</span>
        </>
    ),
};

export function ResumeIllustration({ mode }) {
    return (
        <div className="relative flex-1 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 login-grid" />
            <div className="login-scan" />

            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.22 }}>
                <line x1="10%"  y1="16%" x2="50%" y2="50%" stroke="var(--primary)" strokeWidth="0.8" strokeDasharray="5 5" />
                <line x1="72%"  y1="11%" x2="50%" y2="50%" stroke="var(--primary)" strokeWidth="0.8" strokeDasharray="5 5" />
                <line x1="84%"  y1="50%" x2="50%" y2="50%" stroke="var(--primary)" strokeWidth="0.8" strokeDasharray="5 5" />
                <line x1="68%"  y1="83%" x2="50%" y2="50%" stroke="var(--primary)" strokeWidth="0.8" strokeDasharray="5 5" />
                <line x1="6%"   y1="74%" x2="50%" y2="50%" stroke="var(--primary)" strokeWidth="0.8" strokeDasharray="5 5" />
                <line x1="4%"   y1="44%" x2="50%" y2="50%" stroke="var(--primary)" strokeWidth="0.8" strokeDasharray="5 5" />
                <circle cx="50%" cy="50%" r="3" fill="var(--primary)" opacity="0.5" />
            </svg>

            {/* Resume document */}
            <div className="relative z-10">
                <svg
                    viewBox="0 0 260 340"
                    className="w-44 h-[232px] md:w-52 md:h-[272px] lg:w-56 lg:h-[293px]"
                    style={{ filter: 'drop-shadow(0 0 22px var(--primary))' }}
                >
                    <rect x="20" y="24"  width="224" height="316" fill="var(--primary)" opacity="0.06" />
                    <rect x="14" y="14"  width="224" height="316" fill="var(--card)" stroke="var(--primary)" strokeWidth="1" />
                    <rect x="14" y="14"  width="224" height="54"  fill="var(--primary)" opacity="0.10" />
                    <rect x="28" y="24"  width="30"  height="34"  fill="var(--primary)" opacity="0.22" />
                    <rect x="32" y="28"  width="22"  height="14"  fill="var(--primary)" opacity="0.15" />
                    <rect x="35" y="44"  width="16"  height="10"  fill="var(--primary)" opacity="0.15" />
                    <rect x="70" y="28"  width="108" height="7"   fill="var(--primary)" opacity="0.65" className="login-pulse" />
                    <rect x="70" y="42"  width="72"  height="5"   fill="var(--muted-foreground)" opacity="0.35" />
                    <line x1="14" y1="68" x2="238" y2="68" stroke="var(--border)" strokeWidth="0.8" />
                    <rect x="28" y="82"  width="68"  height="5"   fill="var(--primary)" opacity="0.5" />
                    <rect x="28" y="96"  width="184" height="3"   fill="var(--muted-foreground)" opacity="0.18" />
                    <rect x="28" y="105" width="162" height="3"   fill="var(--muted-foreground)" opacity="0.18" />
                    <rect x="28" y="114" width="174" height="3"   fill="var(--muted-foreground)" opacity="0.18" />
                    <rect x="28" y="123" width="140" height="3"   fill="var(--muted-foreground)" opacity="0.18" />
                    <rect x="28" y="144" width="42"  height="5"   fill="var(--primary)" opacity="0.5" />
                    <rect x="28"  y="158" width="44" height="14"  fill="none" stroke="var(--primary)" strokeWidth="0.8" opacity="0.55" />
                    <rect x="80"  y="158" width="52" height="14"  fill="none" stroke="var(--primary)" strokeWidth="0.8" opacity="0.55" />
                    <rect x="140" y="158" width="40" height="14"  fill="none" stroke="var(--primary)" strokeWidth="0.8" opacity="0.55" />
                    <rect x="188" y="158" width="34" height="14"  fill="none" stroke="var(--primary)" strokeWidth="0.8" opacity="0.55" />
                    <rect x="28" y="192" width="58"  height="5"   fill="var(--primary)" opacity="0.5" />
                    <rect x="28" y="206" width="184" height="3"   fill="var(--muted-foreground)" opacity="0.18" />
                    <rect x="28" y="215" width="148" height="3"   fill="var(--muted-foreground)" opacity="0.18" />
                    <rect x="28" y="224" width="162" height="3"   fill="var(--muted-foreground)" opacity="0.18" />
                    <rect x="28" y="246" width="52"  height="5"   fill="var(--primary)" opacity="0.5" />
                    <rect x="28" y="260" width="184" height="3"   fill="var(--muted-foreground)" opacity="0.18" />
                    <rect x="28" y="269" width="166" height="3"   fill="var(--muted-foreground)" opacity="0.18" />
                    <rect x="28" y="278" width="150" height="3"   fill="var(--muted-foreground)" opacity="0.18" />
                    <rect x="28" y="287" width="175" height="3"   fill="var(--muted-foreground)" opacity="0.18" />
                    <rect x="14" y="316" width="224" height="14"  fill="var(--primary)" opacity="0.08" />
                </svg>
            </div>

            {/* Floating skill nodes */}
            {SKILL_NODES.map((node) => (
                <div
                    key={node.id}
                    className="absolute z-20 login-float"
                    style={{ left: node.x, top: node.y, animationDelay: node.delay }}
                >
                    <div className="px-2 py-1 text-[10px] font-mono border border-primary/45 bg-background/90 text-primary tracking-widest backdrop-blur-sm whitespace-nowrap">
                        {node.label}
                    </div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary opacity-60" />
                </div>
            ))}

            {/* Decorative symbols */}
            <span className="absolute top-10 right-12 text-3xl text-primary/12 font-mono login-float-slow select-none pointer-events-none">{'{ }'}</span>
            <span className="absolute bottom-14 left-8 text-2xl text-primary/12 font-mono login-float-slow select-none pointer-events-none" style={{ animationDelay: '2.1s' }}>{'</>'}</span>
            <span className="absolute top-1/2 right-5 text-xl text-primary/10 font-mono login-float-slow select-none pointer-events-none" style={{ animationDelay: '1.3s' }}>{'[ ]'}</span>

            {/* Mode-aware tagline */}
            <p
                key={mode}
                className="absolute bottom-8 left-8 right-8 z-30 text-[11px] text-muted-foreground tracking-wide leading-relaxed auth-tazgline-fade pointer-events-none"
            >
                {TAGLINES[mode]}
            </p>
        </div>
    );
}
