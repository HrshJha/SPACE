import { motion } from 'framer-motion';

const variants = {
  solid:
    'border-transparent bg-nebula-blue/[0.18] text-white shadow-aura hover:bg-nebula-blue/[0.28]',
  ghost:
    'border-white/20 bg-white/5 text-white hover:border-nebula-blue/40 hover:bg-white/[0.08]',
};

export function GlowButton({
  children,
  variant = 'solid',
  className = '',
  ...props
}) {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full border px-6 py-3 font-mono text-sm uppercase tracking-[0.28em] transition ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-nebula-blue/0 via-white/10 to-plasma/0 opacity-0 transition duration-500 group-hover:opacity-100" />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

export default GlowButton;
