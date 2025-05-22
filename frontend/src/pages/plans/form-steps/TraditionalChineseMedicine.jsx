import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Card,
  CardContent,
  Divider,
  Chip,
  Radio,
  RadioGroup,
  FormControlLabel,
  Slider,
  FormLabel,
  Paper,
  Button,
  IconButton,
  Autocomplete
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Favorite as HeartIcon,
  Air as AirIcon,
  LocalFireDepartment as FireIcon,
  Waves as WaterIcon,
  Park as WoodIcon,
  Layers as EarthIcon,
  TonalityOutlined as YinYangIcon,
  Spa as HarmonyIcon,
  CircleOutlined as EmptyCircleIcon,
  Circle as FilledCircleIcon,
  Pets as QiIcon,
  SettingsSuggest as MeridianIcon,
  Colorize as PulseIcon,
  Tongue as TongueIcon
} from '@mui/icons-material';

// Cinco elementos da MTC
const elements = [
  { name: 'Madeira', icon: <WoodIcon />, color: '#4caf50' },
  { name: 'Fogo', icon: <FireIcon />, color: '#f44336' },
  { name: 'Terra', icon: <EarthIcon />, color: '#ff9800' },
  { name: 'Metal', icon: <Layers />, color: '#9e9e9e' },
  { name: 'u00c1gua', icon: <WaterIcon />, color: '#2196f3' }
];

// Meridianos principais
const meridians = [
  'Pulmu00e3o (P)',
  'Intestino Grosso (IG)',
  'Estnu00f4mago (E)',
  'Bau00e7o-Pu00e2ncreas (BP)',
  'Corau00e7u00e3o (C)',
  'Intestino Delgado (ID)',
  'Bexiga (B)',
  'Rim (R)',
  'Circulau00e7u00e3o-Sexualidade (CS)',
  'Tru00edplice Aquecedor (TA)',
  'Vesu00edcula Biliar (VB)',
  'Fu00edgado (F)',
  'Vaso Concepu00e7u00e3o (VC)',
  'Vaso Governador (VG)'
];

// Padru00f5es de desarmonia
const disharmonyPatterns = [
  'Deficencia de Qi',
  'Estagnau00e7u00e3o de Qi',
  'Deficencia de Yang',
  'Deficencia de Yin',
  'Deficencia de Sangue',
  'Estagnau00e7u00e3o de Sangue',
  'Deficencia de Jing (Essu00eancia)',
  'Calor/Fogo',
  'Frio',
  'Umidade',
  'Secura',
  'Vento',
  'Fleuma'
];

// Tipos de constituiu00e7u00e3o
const constitutionTypes = [
  'Equilibrada (Balanceada)',
  'Deficencia de Yang',
  'Deficencia de Yin',
  'Estagnau00e7u00e3o de Qi',
  'Umidade-Fleuma',
  'Calor Interno',
  'Qi Debilitado',
  'Sangue Fraco',
  'Qi e Sangue Fracos'
];

// Caracteristicas da lingua
const tongueCharacteristics = [
  // Cor
  { category: 'Cor', options: ['Pu00e1lida', 'Rosada (normal)', 'Vermelha', 'Vermelha escura', 'Pu00farpura', 'Azulada'] },
  // Forma
  { category: 'Forma', options: ['Normal', 'Inchada', 'Fina', 'Rachada', 'Dente-marcada', 'Tru00eamula', 'Ru00edgida', 'Flu00e1cida'] },
  // Saburra
  { category: 'Saburra', options: ['Fina (normal)', 'Grossa', 'Pegajosa', 'Seca', 'Ausente', 'Escorregadia'] },
  // Cor da saburra
  { category: 'Cor da Saburra', options: ['Branca', 'Amarela', 'Cinza', 'Preta', 'Castanha'] }
];

/**
 * Componente para registro e anu00e1lise de medicina tradicional chinesa
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.data - Dados atuais da avaliau00e7u00e3o de MTC
 * @param {Function} props.onChange - Funu00e7u00e3o para atualizar os dados
 */
const TraditionalChineseMedicine = ({ data, onChange }) => {
  const initialData = {
    constitution_type: '',
    dominant_element: '',
    disharmony_patterns: [],
    imbalanced_meridians: [],
    tongue_diagnosis: {
      color: 'Rosada (normal)',
      shape: 'Normal',
      coating: 'Fina (normal)',
      coating_color: 'Branca',
      notes: ''
    },
    pulse_diagnosis: {
      left_distal: '',
      left_middle: '',
      left_proximal: '',
      right_distal: '',
      right_middle: '',
      right_proximal: '',
      notes: ''
    },
    organ_imbalances: {
      liver: 0,
      heart: 0,
      spleen: 0,
      lung: 0,
      kidney: 0,
      gallbladder: 0,
      stomach: 0,
      small_intestine: 0,
      large_intestine: 0,
      bladder: 0
    },
    yin_yang_balance: 5, // 0 (excesso de yin) a 10 (excesso de yang)
    notes: ''
  };

  const [formData, setFormData] = useState(data || initialData);

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

  // Manipular mudanu00e7as em campos simples
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Manipular mudanu00e7as em campos de objetos aninhados
  const handleNestedChange = (parent, field, value) => {
    setFormData({
      ...formData,
      [parent]: {
        ...formData[parent],
        [field]: value
      }
    });
  };

  // Manipular mudanu00e7as em arrays
  const handleArrayChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Renderizar slider para um u00f3rgu00e3o
  const renderOrganSlider = (organ, label, icon) => (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {icon}
        <Typography variant="body2" sx={{ ml: 1 }}>
          {label}
        </Typography>
      </Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <Slider
            value={formData.organ_imbalances[organ]}
            onChange={(e, newValue) => 
              handleNestedChange('organ_imbalances', organ, newValue)
            }
            step={1}
            marks
            min={-5}
            max={5}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item>
          <Typography variant="body2">
            {formData.organ_imbalances[organ]}
          </Typography>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: -1 }}>
        <Typography variant="caption">Deficencia</Typography>
        <Typography variant="caption">Equilibrado</Typography>
        <Typography variant="caption">Excesso</Typography>
      </Box>
    </Box>
  );

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h5" gutterBottom color="primary">
          Medicina Tradicional Chinesa (MTC)
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          Registre a avaliau00e7u00e3o segundo os princpios da Medicina Tradicional Chinesa, incluindo diagnu00f3stico por pulso, lu00edngua, desequilu00edbrios de u00f3rgu00e3os e identificau00e7u00e3o de padru00f5es de desarmonia.
        </Typography>

        <Grid container spacing={3}>
          {/* Constituiu00e7u00e3o e Elemento Dominante */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <YinYangIcon color="primary" />
                    Constituiu00e7u00e3o e Elemento
                  </Typography>
                  
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="constitution-type-label">Tipo de Constituiu00e7u00e3o</InputLabel>
                    <Select
                      labelId="constitution-type-label"
                      name="constitution_type"
                      value={formData.constitution_type}
                      onChange={handleChange}
                      label="Tipo de Constituiu00e7u00e3o"
                    >
                      <MenuItem value=""><em>Selecione</em></MenuItem>
                      {constitutionTypes.map((type) => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl fullWidth>
                    <InputLabel id="dominant-element-label">Elemento Dominante</InputLabel>
                    <Select
                      labelId="dominant-element-label"
                      name="dominant_element"
                      value={formData.dominant_element}
                      onChange={handleChange}
                      label="Elemento Dominante"
                    >
                      <MenuItem value=""><em>Selecione</em></MenuItem>
                      {elements.map((element) => (
                        <MenuItem key={element.name} value={element.name}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ color: element.color, mr: 1 }}>{element.icon}</Box>
                            {element.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Balanu00e7o Yin-Yang
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                      <YinYangIcon 
                        sx={{ 
                          fontSize: 40, 
                          transform: `rotate(${(formData.yin_yang_balance - 5) * 36}deg)`,
                          transition: 'transform 0.5s'
                        }} 
                      />
                    </Box>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <Typography sx={{ color: '#0288d1' }}>
                          Yin
                        </Typography>
                      </Grid>
                      <Grid item xs>
                        <Slider
                          value={formData.yin_yang_balance}
                          onChange={(e, newValue) => 
                            setFormData({ ...formData, yin_yang_balance: newValue })
                          }
                          step={1}
                          marks
                          min={0}
                          max={10}
                          valueLabelDisplay="auto"
                        />
                      </Grid>
                      <Grid item>
                        <Typography sx={{ color: '#f44336' }}>
                          Yang
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          
          {/* Padru00f5es de Desarmonia */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <QiIcon color="primary" />
                    Padru00f5es de Desarmonia
                  </Typography>
                  
                  <Autocomplete
                    multiple
                    options={disharmonyPatterns}
                    value={formData.disharmony_patterns}
                    onChange={(event, newValue) => handleArrayChange('disharmony_patterns', newValue)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          variant="outlined"
                          label={option}
                          {...getTagProps({ index })}
                          key={index}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Padru00f5es Identificados"
                        placeholder="Selecione ou adicione"
                      />
                    )}
                  />
                  
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Meridianos em Desequilu00edbrio
                    </Typography>
                    <Autocomplete
                      multiple
                      options={meridians}
                      value={formData.imbalanced_meridians}
                      onChange={(event, newValue) => handleArrayChange('imbalanced_meridians', newValue)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            variant="outlined"
                            label={option}
                            {...getTagProps({ index })}
                            key={index}
                            icon={<MeridianIcon />}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Meridianos Afetados"
                          placeholder="Selecione ou adicione"
                        />
                      )}
                    />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          
          {/* Diagnu00f3stico por Lu00edngua */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TongueIcon color="primary" />
                    Diagnu00f3stico pela Lu00edngua
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {tongueCharacteristics.map((characteristic, index) => (
                      <Grid item xs={12} sm={6} key={characteristic.category}>
                        <FormControl fullWidth size="small">
                          <InputLabel id={`tongue-${characteristic.category}-label`}>
                            {characteristic.category}
                          </InputLabel>
                          <Select
                            labelId={`tongue-${characteristic.category}-label`}
                            value={formData.tongue_diagnosis[characteristic.category.toLowerCase().replace(' ', '_')]}
                            onChange={(e) => handleNestedChange(
                              'tongue_diagnosis', 
                              characteristic.category.toLowerCase().replace(' ', '_'), 
                              e.target.value
                            )}
                            label={characteristic.category}
                          >
                            {characteristic.options.map((option) => (
                              <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    ))}
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Observau00e7u00f5es sobre a Lu00edngua"
                        multiline
                        rows={2}
                        value={formData.tongue_diagnosis.notes}
                        onChange={(e) => handleNestedChange('tongue_diagnosis', 'notes', e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          
          {/* Diagnu00f3stico por Pulso */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PulseIcon color="primary" />
                    Diagnu00f3stico pelo Pulso
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Pulso Esquerdo
                      </Typography>
                      <TextField
                        fullWidth
                        label="Distal (Corau00e7u00e3o/Intestino Delgado)"
                        value={formData.pulse_diagnosis.left_distal}
                        onChange={(e) => handleNestedChange('pulse_diagnosis', 'left_distal', e.target.value)}
                        margin="dense"
                        size="small"
                      />
                      <TextField
                        fullWidth
                        label="Mu00e9dio (Fu00edgado/Vesu00edcula Biliar)"
                        value={formData.pulse_diagnosis.left_middle}
                        onChange={(e) => handleNestedChange('pulse_diagnosis', 'left_middle', e.target.value)}
                        margin="dense"
                        size="small"
                      />
                      <TextField
                        fullWidth
                        label="Proximal (Rim/Bexiga)"
                        value={formData.pulse_diagnosis.left_proximal}
                        onChange={(e) => handleNestedChange('pulse_diagnosis', 'left_proximal', e.target.value)}
                        margin="dense"
                        size="small"
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Pulso Direito
                      </Typography>
                      <TextField
                        fullWidth
                        label="Distal (Pulmu00e3o/Intestino Grosso)"
                        value={formData.pulse_diagnosis.right_distal}
                        onChange={(e) => handleNestedChange('pulse_diagnosis', 'right_distal', e.target.value)}
                        margin="dense"
                        size="small"
                      />
                      <TextField
                        fullWidth
                        label="Mu00e9dio (Bau00e7o/Estnu00f4mago)"
                        value={formData.pulse_diagnosis.right_middle}
                        onChange={(e) => handleNestedChange('pulse_diagnosis', 'right_middle', e.target.value)}
                        margin="dense"
                        size="small"
                      />
                      <TextField
                        fullWidth
                        label="Proximal (Circulau00e7u00e3o-Sexualidade/Tru00edplice Aquecedor)"
                        value={formData.pulse_diagnosis.right_proximal}
                        onChange={(e) => handleNestedChange('pulse_diagnosis', 'right_proximal', e.target.value)}
                        margin="dense"
                        size="small"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Observau00e7u00f5es sobre o Pulso"
                        multiline
                        rows={2}
                        value={formData.pulse_diagnosis.notes}
                        onChange={(e) => handleNestedChange('pulse_diagnosis', 'notes', e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          
          {/* Balanu00e7o de u00d3rgu00e3os */}
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HarmonyIcon color="primary" />
                    Balanu00e7o dos u00d3rgu00e3os (Zang-Fu)
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Avalie o grau de desequilu00edbrio para cada u00f3rgu00e3o, de -5 (deficencia extrema) a +5 (excesso extremo), com 0 representando o equilu00edbrio ideal.
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      {renderOrganSlider('liver', 'Fu00edgado (Gan)', <WoodIcon sx={{ color: '#4caf50' }} />)}
                      {renderOrganSlider('heart', 'Corau00e7u00e3o (Xin)', <HeartIcon sx={{ color: '#f44336' }} />)}
                      {renderOrganSlider('spleen', 'Bau00e7o-Pu00e2ncreas (Pi)', <EarthIcon sx={{ color: '#ff9800' }} />)}
                      {renderOrganSlider('lung', 'Pulmu00e3o (Fei)', <AirIcon sx={{ color: '#9e9e9e' }} />)}
                      {renderOrganSlider('kidney', 'Rim (Shen)', <WaterIcon sx={{ color: '#2196f3' }} />)}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      {renderOrganSlider('gallbladder', 'Vesu00edcula Biliar (Dan)', <WoodIcon sx={{ color: '#4caf50' }} />)}
                      {renderOrganSlider('small_intestine', 'Intestino Delgado (Xiaochang)', <FireIcon sx={{ color: '#f44336' }} />)}
                      {renderOrganSlider('stomach', 'Estnu00f4mago (Wei)', <EarthIcon sx={{ color: '#ff9800' }} />)}
                      {renderOrganSlider('large_intestine', 'Intestino Grosso (Dachang)', <AirIcon sx={{ color: '#9e9e9e' }} />)}
                      {renderOrganSlider('bladder', 'Bexiga (Pangguang)', <WaterIcon sx={{ color: '#2196f3' }} />)}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          
          {/* Observau00e7u00f5es Gerais */}
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <TextField
                fullWidth
                label="Observau00e7u00f5es e Recomendau00e7u00f5es baseadas na MTC"
                multiline
                rows={4}
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Registre suas observau00e7u00f5es, anu00e1lises e recomendau00e7u00f5es baseadas na Medicina Tradicional Chinesa para esta paciente..."
              />
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default TraditionalChineseMedicine;
