import { motion } from 'framer-motion';

const variants = {
  solid: 'glow-button-primary',
  ghost: 'glow-button-primary glow-button-secondary',
};

export function GlowButton({
  children,
  variant = 'solid',
  className = '',
  ...props
}) {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`group relative overflow-hidden ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-nebula-blue/0 via-white/10 to-plasma/0 opacity-0 transition duration-500 group-hover:opacity-100" />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

export default GlowButton;
