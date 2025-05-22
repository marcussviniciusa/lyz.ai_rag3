// Coleção de transições e animações com Framer Motion para o sistema Lyz
// Estas animações ajudam a criar uma experiência moderna e fluida

// Transição padrão para elementos que aparecem na tela
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
};

// Transição para cards e painéis
export const cardAnimation = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  whileHover: { scale: 1.02, boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.12)" },
  whileTap: { scale: 0.98 }
};

// Transição para itens em uma lista
export const listItemAnimation = (index) => ({
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3, delay: index * 0.05, ease: [0.4, 0, 0.2, 1] }
});

// Animação de pulso para destacar elementos
export const pulseAnimation = {
  initial: { scale: 1 },
  animate: { scale: [1, 1.03, 1], transition: { duration: 1.5, repeat: Infinity, repeatType: "loop" } }
};

// Transição para entrada de página
export const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.4 }
};

// Animação para botões
export const buttonAnimation = {
  whileHover: { scale: 1.05, transition: { duration: 0.2 } },
  whileTap: { scale: 0.95, transition: { duration: 0.1 } }
};

// Animação para elementos que aparecem em sequência
export const staggerContainer = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.07,
      delayChildren: 0.2 
    } 
  }
};

// Animação para itens que aparecem em sequência dentro de um container
export const staggerItem = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
  exit: { y: 20, opacity: 0 }
};

// Animação de slide para steppers e carrosséis
export const slideAnimation = (direction) => {
  return {
    initial: { 
      x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
      y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0,
      opacity: 0 
    },
    animate: { 
      x: 0,
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
    },
    exit: { 
      x: direction === 'left' ? 100 : direction === 'right' ? -100 : 0,
      y: direction === 'up' ? -100 : direction === 'down' ? 100 : 0,
      opacity: 0,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
    }
  };
};

// Animação para transições de escala
export const scaleAnimation = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0, opacity: 0 },
  transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
};

// Animação para ícones
export const iconAnimation = {
  initial: { rotate: 0 },
  whileHover: { rotate: 15, scale: 1.2, transition: { duration: 0.2 } },
  whileTap: { rotate: 0, scale: 0.9 }
};

// Animação para loading e progresso
export const loadingAnimation = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } }
};
