import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
  Divider,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  InfoOutlined as InfoIcon,
  Psychology as MindIcon,
  Restaurant as NutritionIcon,
  FitnessCenter as MovementIcon,
  Healing as DigestiveIcon,
  BloodtypeOutlined as DetoxIcon,
  Shield as ImmuneIcon,
  LocalFireDepartment as InflammationIcon,
  WbSunny as EnergyIcon,
  Lightbulb as InsightIcon,
  LiveTv as ExposomeIcon,
  Bed as StructuralIcon,
  Spa as CommunityIcon,
  Balance as BalanceIcon,
  Coronavirus as InfectionIcon,
  Biotech as BiotransformationIcon
} from '@mui/icons-material';

// Definiu00e7u00e3o dos nu00f3s da matriz IFM
const ifmNodes = [
  {
    id: 'assimilation',
    name: 'Assimilau00e7u00e3o',
    icon: <DigestiveIcon />,
    color: '#2196f3',
    description: 'Avaliau00e7u00e3o da digestu00e3o, absoru00e7u00e3o, microbioma e permeabilidade intestinal.'
  },
  {
    id: 'defense',
    name: 'Defesa e Reparau00e7u00e3o',
    icon: <ImmuneIcon />,
    color: '#4caf50',
    description: 'Avaliau00e7u00e3o do sistema imunolu00f3gico e processo de reparau00e7u00e3o celular.'
  },
  {
    id: 'energy',
    name: 'Produu00e7u00e3o de Energia',
    icon: <EnergyIcon />,
    color: '#ff9800',
    description: 'Avaliau00e7u00e3o do metabolismo energu00e9tico, mitocnu00f4ndrias e estresse oxidativo.'
  },
  {
    id: 'biotransformation',
    name: 'Biotransformau00e7u00e3o e Eliminau00e7u00e3o',
    icon: <BiotransformationIcon />,
    color: '#9c27b0',
    description: 'Avaliau00e7u00e3o da detoxificau00e7u00e3o e eliminau00e7u00e3o de toxinas.'
  },
  {
    id: 'transport',
    name: 'Transporte',
    icon: <BloodtypeOutlined />,
    color: '#f44336',
    description: 'Avaliau00e7u00e3o da circulau00e7u00e3o, sistema cardiovascular e linftico.'
  },
  {
    id: 'communication',
    name: 'Comunicau00e7u00e3o',
    icon: <BalanceIcon />,
    color: '#00bcd4',
    description: 'Avaliau00e7u00e3o do equilu00edbrio hormonal, neurotransmissores e comunicau00e7u00e3o celular.'
  },
  {
    id: 'structural_integrity',
    name: 'Integridade Estrutural',
    icon: <StructuralIcon />,
    color: '#795548',
    description: 'Avaliação da estrutura musculoesquelética, membranas celulares e tecido conectivo.'
  },
  {
    id: 'mental_emotional',
    name: 'Aspecto Mental-Emocional',
    icon: <MindIcon />,
    color: '#673ab7',
    description: 'Avaliação do estresse, resiliência e estado emocional.'
  },
  {
    id: 'nutrition',
    name: 'Nutriu00e7u00e3o',
    icon: <NutritionIcon />,
    color: '#8bc34a',
    description: 'Avaliau00e7u00e3o do estado nutricional, deficencias e padru00f5es alimentares.'
  },
  {
    id: 'movement',
    name: 'Movimento, Exercu00edcio e Respiro',
    icon: <MovementIcon />,
    color: '#ff5722',
    description: 'Avaliau00e7u00e3o do nvel de atividade fu00edsica e padru00f5es respiratu00f3rios.'
  },
  {
    id: 'sleep_relaxation',
    name: 'Sono e Relaxamento',
    icon: <Bed />,
    color: '#3f51b5',
    description: 'Avaliau00e7u00e3o da qualidade do sono e habilidade de relaxamento.'
  },
  {
    id: 'relationships',
    name: 'Relacionamentos e Redes de Apoio',
    icon: <CommunityIcon />,
    color: '#e91e63',
    description: 'Avaliau00e7u00e3o das relau00e7u00f5es interpessoais e suporte social.'
  },
  {
    id: 'exposome',
    name: 'Exposoma e Ambiente',
    icon: <ExposomeIcon />,
    color: '#607d8b',
    description: 'Avaliau00e7u00e3o da exposiu00e7u00e3o ambiental a toxinas, poluentes e alergenos.'
  },
  {
    id: 'spiritual',
    name: 'Espiritualidade e Propu00f3sito',
    icon: <InsightIcon />,
    color: '#ffc107',
    description: 'Avaliau00e7u00e3o do sentido de propu00f3sito, valores e crenças pessoais.'
  },
  {
    id: 'inflammation',
    name: 'Inflamau00e7u00e3o',
    icon: <InflammationIcon />,
    color: '#e57373',
    description: 'Avaliau00e7u00e3o do processo inflamatu00f3rio sistu00eamico e localizado.'
  },
  {
    id: 'infection',
    name: 'Infecu00e7u00e3o e Disbiose',
    icon: <InfectionIcon />,
    color: '#4db6ac',
    description: 'Avaliau00e7u00e3o de infecu00e7u00f5es cru00f4nicas ou recorrentes e desequilu00edbrio da microbiota.'
  }
];

/**
 * Componente para a avaliau00e7u00e3o da Matriz do Instituto de Medicina Funcional (IFM)
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.data - Dados atuais da matriz IFM
 * @param {Function} props.onChange - Funu00e7u00e3o para atualizar os dados
 */
const IFMMatrix = ({ data, onChange }) => {
  const theme = useTheme();
  
  // Inicializar dados com valores padru00e3o
  const initialData = {
    nodes: ifmNodes.reduce((acc, node) => {
      acc[node.id] = {
        score: 0,
        notes: '',
        interventions: ''
      };
      return acc;
    }, {})
  };

  const [formData, setFormData] = useState(data || initialData);
  const [selectedNode, setSelectedNode] = useState(null);

  // Atualizar formulu00e1rio quando os dados externos mudarem
  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  // Propagar mudanu00e7as para o componente pai
  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  // Manipular mudanu00e7a no score do nu00f3
  const handleScoreChange = (nodeId, newValue) => {
    setFormData(prev => ({
      ...prev,
      nodes: {
        ...prev.nodes,
        [nodeId]: {
          ...prev.nodes[nodeId],
          score: newValue
        }
      }
    }));
  };

  // Manipular mudanu00e7a nas observau00e7u00f5es do nu00f3
  const handleNotesChange = (nodeId, event) => {
    const { value } = event.target;
    setFormData(prev => ({
      ...prev,
      nodes: {
        ...prev.nodes,
        [nodeId]: {
          ...prev.nodes[nodeId],
          notes: value
        }
      }
    }));
  };

  // Manipular mudanu00e7a nas intervenu00e7u00f5es do nu00f3
  const handleInterventionsChange = (nodeId, event) => {
    const { value } = event.target;
    setFormData(prev => ({
      ...prev,
      nodes: {
        ...prev.nodes,
        [nodeId]: {
          ...prev.nodes[nodeId],
          interventions: value
        }
      }
    }));
  };

  // Selecionar um nu00f3 para exibiu00e7u00e3o detalhada
  const handleNodeSelect = (nodeId) => {
    setSelectedNode(nodeId === selectedNode ? null : nodeId);
  };

  // Obter cor baseada no score
  const getScoreColor = (score) => {
    if (score <= 2) return '#4caf50'; // Verde - Baixa preocupau00e7u00e3o
    if (score <= 6) return '#ff9800'; // Laranja - Mu00e9dia preocupau00e7u00e3o
    return '#f44336'; // Vermelho - Alta preocupau00e7u00e3o
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h5" gutterBottom color="primary">
          Matriz IFM (Instituto de Medicina Funcional)
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          A Matriz IFM u00e9 uma ferramenta de organizau00e7u00e3o clu00ednica que ajuda a mapear os principais fatores funcionais que influenciam a sau00fade da paciente. Avalie cada u00e1rea com uma pontuau00e7u00e3o de 0 (sem preocupau00e7u00e3o) a 10 (alta preocupau00e7u00e3o) e registre observau00e7u00f5es especu00edficas.
        </Typography>

        <Grid container spacing={3}>
          {/* Visu00e3o geral da matriz */}
          <Grid item xs={12}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                backgroundImage: `radial-gradient(circle at center, ${theme.palette.background.default}, ${theme.palette.background.paper})`,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                  Visu00e3o Geral da Matriz
                </Typography>
                
                <Grid container spacing={2}>
                  {ifmNodes.map((node) => {
                    const nodeData = formData.nodes[node.id] || { score: 0, notes: '' };
                    const scoreColor = getScoreColor(nodeData.score);
                    
                    return (
                      <Grid item xs={6} sm={4} md={3} key={node.id}>
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card 
                            sx={{ 
                              height: '100%',
                              cursor: 'pointer',
                              borderTop: `3px solid ${node.color}`,
                              borderRadius: 2,
                              transition: 'all 0.3s',
                              boxShadow: selectedNode === node.id ? 
                                `0 0 0 2px ${node.color}, 0 4px 8px rgba(0,0,0,0.1)` : 
                                '0 1px 3px rgba(0,0,0,0.1)',
                              opacity: selectedNode && selectedNode !== node.id ? 0.7 : 1
                            }}
                            onClick={() => handleNodeSelect(node.id)}
                          >
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Box sx={{ color: node.color, mr: 1 }}>
                                  {node.icon}
                                </Box>
                                <Typography variant="subtitle2" noWrap>
                                  {node.name}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Box 
                                  sx={{ 
                                    width: 16, 
                                    height: 16, 
                                    borderRadius: '50%', 
                                    bgcolor: scoreColor,
                                    mr: 1 
                                  }} 
                                />
                                <Typography variant="body2">
                                  Score: {nodeData.score}/10
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            </Paper>
          </Grid>
          
          {/* Detalhes do nu00f3 selecionado */}
          {selectedNode && (
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {(() => {
                  const node = ifmNodes.find(n => n.id === selectedNode);
                  const nodeData = formData.nodes[selectedNode] || { score: 0, notes: '', interventions: '' };
                  
                  return (
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        borderColor: node.color,
                        borderWidth: 2,
                        borderRadius: 2
                      }}
                    >
                      <CardHeader
                        title={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ color: node.color, mr: 1 }}>
                              {node.icon}
                            </Box>
                            <Typography variant="h6">{node.name}</Typography>
                          </Box>
                        }
                        action={
                          <Tooltip title={node.description} arrow placement="left">
                            <IconButton size="small">
                              <InfoIcon />
                            </IconButton>
                          </Tooltip>
                        }
                        sx={{ pb: 0 }}
                      />
                      <CardContent>
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Nu00edvel de Preocupau00e7u00e3o/Desequilu00edbrio
                          </Typography>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs>
                              <Slider
                                value={nodeData.score}
                                onChange={(e, newValue) => handleScoreChange(selectedNode, newValue)}
                                step={1}
                                marks
                                min={0}
                                max={10}
                                valueLabelDisplay="auto"
                                sx={{ 
                                  color: getScoreColor(nodeData.score),
                                  '& .MuiSlider-valueLabel': {
                                    backgroundColor: getScoreColor(nodeData.score)
                                  }
                                }}
                              />
                            </Grid>
                            <Grid item>
                              <Typography variant="body2">
                                {nodeData.score}/10
                              </Typography>
                            </Grid>
                          </Grid>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="caption" sx={{ color: '#4caf50' }}>Baixo</Typography>
                            <Typography variant="caption" sx={{ color: '#ff9800' }}>Mu00e9dio</Typography>
                            <Typography variant="caption" sx={{ color: '#f44336' }}>Alto</Typography>
                          </Box>
                        </Box>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Box sx={{ mb: 3 }}>
                          <TextField
                            fullWidth
                            label="Observau00e7u00f5es e Achados Clu00ednicos"
                            multiline
                            rows={3}
                            value={nodeData.notes}
                            onChange={(e) => handleNotesChange(selectedNode, e)}
                            placeholder={`Registre observau00e7u00f5es relevantes sobre ${node.name.toLowerCase()} da paciente...`}
                          />
                        </Box>
                        
                        <Box>
                          <TextField
                            fullWidth
                            label="Intervenu00e7u00f5es Recomendadas"
                            multiline
                            rows={3}
                            value={nodeData.interventions}
                            onChange={(e) => handleInterventionsChange(selectedNode, e)}
                            placeholder="Registre intervenu00e7u00f5es funcionais recomendadas para esta u00e1rea..."
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })()}
              </motion.div>
            </Grid>
          )}
          
          {/* Se nenhum nu00f3 estiver selecionado, mostrar instruu00e7u00f5es */}
          {!selectedNode && (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, bgcolor: 'background.default', textAlign: 'center' }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Selecione um dos elementos da matriz acima para adicionar detalhes e intervenu00e7u00f5es
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </motion.div>
    </Box>
  );
};

export default IFMMatrix;
