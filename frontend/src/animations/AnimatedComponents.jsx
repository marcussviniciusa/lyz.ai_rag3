import React from 'react';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';
import {
  fadeInUp,
  cardAnimation,
  listItemAnimation,
  pageTransition,
  staggerContainer,
  staggerItem,
  slideAnimation
} from './transitions';

/**
 * AnimatedContainer - Um wrapper de contu00eainer com animau00e7u00f5es de entrada e sau00edda
 * 
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Conteu00fado do container
 * @param {Object} props.animation - Objeto de animau00e7u00e3o (opcional, usa fadeInUp por padru00e3o)
 * @param {Object} props.sx - Estilos adicionais para o container
 * @returns {React.ReactElement} Componente AnimatedContainer
 */
export const AnimatedContainer = ({ children, animation = fadeInUp, sx = {}, ...props }) => {
  return (
    <motion.div
      initial={animation.initial}
      animate={animation.animate}
      exit={animation.exit}
      transition={animation.transition}
      {...props}
    >
      <Box sx={sx}>
        {children}
      </Box>
    </motion.div>
  );
};

/**
 * AnimatedCard - Um componente de card com animau00e7u00f5es suaves
 * 
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Conteu00fado do card
 * @param {Object} props.sx - Estilos adicionais para o card
 * @returns {React.ReactElement} Componente AnimatedCard
 */
export const AnimatedCard = ({ children, sx = {}, ...props }) => {
  return (
    <motion.div
      initial={cardAnimation.initial}
      animate={cardAnimation.animate}
      exit={cardAnimation.exit}
      transition={cardAnimation.transition}
      whileHover={cardAnimation.whileHover}
      whileTap={cardAnimation.whileTap}
      {...props}
    >
      <Box 
        sx={{ 
          borderRadius: 4, 
          overflow: 'hidden',
          backgroundColor: 'background.paper',
          boxShadow: 3,
          p: 3,
          ...sx 
        }}
      >
        {children}
      </Box>
    </motion.div>
  );
};

/**
 * AnimatedItem - Um componente de item com animau00e7u00e3o para uso em listas
 * 
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Conteu00fado do item
 * @param {number} props.index - u00cdndice do item na lista (para escalonamento da animau00e7u00e3o)
 * @param {Object} props.sx - Estilos adicionais para o item
 * @returns {React.ReactElement} Componente AnimatedItem
 */
export const AnimatedItem = ({ children, index = 0, sx = {}, ...props }) => {
  const animation = listItemAnimation(index);
  
  return (
    <motion.div
      initial={animation.initial}
      animate={animation.animate}
      exit={animation.exit}
      transition={animation.transition}
      {...props}
    >
      <Box sx={sx}>{children}</Box>
    </motion.div>
  );
};

/**
 * AnimatedPage - Um wrapper para pu00e1ginas com animau00e7u00f5es de transiu00e7u00e3o
 * 
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Conteu00fado da pu00e1gina
 * @param {Object} props.sx - Estilos adicionais para a pu00e1gina
 * @returns {React.ReactElement} Componente AnimatedPage
 */
export const AnimatedPage = ({ children, sx = {}, ...props }) => {
  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      transition={pageTransition.transition}
      {...props}
    >
      <Box sx={{ minHeight: '100vh', ...sx }}>
        {children}
      </Box>
    </motion.div>
  );
};

/**
 * StaggerContainer - Um container que anima seus filhos em sequu00eancia
 * 
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Conteu00fado do container
 * @param {Object} props.sx - Estilos adicionais para o container
 * @returns {React.ReactElement} Componente StaggerContainer
 */
export const StaggerContainer = ({ children, sx = {}, ...props }) => {
  return (
    <motion.div
      initial={staggerContainer.initial}
      animate={staggerContainer.animate}
      {...props}
    >
      <Box sx={sx}>{children}</Box>
    </motion.div>
  );
};

/**
 * StaggerItem - Um item a ser usado dentro de um StaggerContainer
 * 
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Conteu00fado do item
 * @param {Object} props.sx - Estilos adicionais para o item
 * @returns {React.ReactElement} Componente StaggerItem
 */
export const StaggerItem = ({ children, sx = {}, ...props }) => {
  return (
    <motion.div
      variants={staggerItem}
      {...props}
    >
      <Box sx={sx}>{children}</Box>
    </motion.div>
  );
};

/**
 * SlideContainer - Um container com animau00e7u00e3o de slide em uma direu00e7u00e3o especu00edfica
 * 
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Conteu00fado do container
 * @param {string} props.direction - Direu00e7u00e3o do slide ('left', 'right', 'up', 'down')
 * @param {Object} props.sx - Estilos adicionais para o container
 * @returns {React.ReactElement} Componente SlideContainer
 */
export const SlideContainer = ({ children, direction = 'left', sx = {}, ...props }) => {
  const animation = slideAnimation(direction);
  
  return (
    <motion.div
      initial={animation.initial}
      animate={animation.animate}
      exit={animation.exit}
      {...props}
    >
      <Box sx={sx}>{children}</Box>
    </motion.div>
  );
};
