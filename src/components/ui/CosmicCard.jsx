import { motion } from 'framer-motion';

export function CosmicCard({ children, className = '', ...props }) {
  return (
    <motion.div
      whileHover={{ rotateX: 4, rotateY: -4, y: -6 }}
      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
      className={`cosmic-card ${className}`}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(74,158,255,0.16),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

export default CosmicCard;
