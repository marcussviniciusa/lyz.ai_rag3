import { Edit as EditIcon } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  TextField,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Paper,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  DeleteOutline as DeleteIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  FolderOpen as FolderIcon,
  Description as FileIcon,
  BarChart as ResultsIcon,
  DateRange as DateIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import MinioService from '../../../services/minio.service';

// Tipos de exames comuns
const examTypes = [
  'Hemograma Completo',
  'Glicemia de Jejum',
  'Hemoglobina Glicada (HbA1c)',
  'Perfil Lipd\u00edco',
  'TSH e T4 Livre',
  'Ferritina',
  'Vitamina D (25-OH)',
  'Vitamina B12',
  '\u00c1cido F\u00f3lico',
  'Homociste\u00edna',
  'PCR (Prote\u00edna C Reativa)',
  'VHS (Velocidade de Hemossedimenta\u00e7\u00e3o)',
  'Insulina Basal',
  'HOMA-IR',
  'FSH',
  'LH',
  'Estradiol',
  'Progesterona',
  'Testosterona Total e Livre',
  'DHEA-S',
  'Prolactina',
  'Cortisol',
  'Fun\u00e7\u00e3o Hep\u00e1tica (TGO, TGP, GGT)',
  'Fun\u00e7\u00e3o Renal (Ur\u00e9ia, Creatinina)',
  'Electr\u00f3litos (S\u00f3dio, Pot\u00e1ssio, Cloro)',
  'Magn\u00e9sio',
  'C\u00e1lcio e F\u00f3sforo',
  'Zinco',
  'Ferro S\u00e9rico',
  'Capacidade de Liga\u00e7\u00e3o do Ferro',
  'Satura\u00e7\u00e3o da Transferrina',
  'Horm\u00f4nios Tireoidianos Completo',
  'Anticorpos Antitireoidianos',
  'Densitometria \u00d3ssea',
  'Urina Tipo I',
  'Urocultura',
  'Parasitol\u00f3gico de Fezes',
  'VDRL/SIFILIS',
  'Sorologia para HIV',
  'Sorologia para Hepatites',
  'PCR em Tempo Real',
  'Ecografia Transvaginal',
  'Ecografia Pelvica',
  'Ecografia Mam\u00e1ria',
  'Mamografia',
  'Colonoscopia',
  'Endoscopia Digestiva Alta',
  'Eletrocardiograma',
  'Teste Ergom\u00e9trico',
  'Outros'
];

// Tipos de arquivos permitidos
const allowedFileTypes = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/tiff',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel'
];

/**
 * Componente para gerenciamento de exames e resultados laboratoriais
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.data - Dados atuais dos exames
 * @param {Function} props.onChange - Fun\u00e7\u00e3o para atualizar os dados
 */
const LabResults = ({ data, onChange }) => {
  const initialData = {
    exams: []
  };

  const [formData, setFormData] = useState(data || initialData);
  const [currentExam, setCurrentExam] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fileError, setFileError] = useState(''); 
  const [filePreviewUrl, setFilePreviewUrl] = useState('');
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);

  // Atualizar formul\u00e1rio quando os dados externos mudarem
  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  // Propagar mudan\u00e7as para o componente pai
  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  // Limpar URL do preview ao fechar o di\u00e1logo
  useEffect(() => {
    if (!previewDialogOpen && filePreviewUrl) {
      // Revogar URL para evitar vazamento de mem\u00f3ria
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl('');
    }
  }, [previewDialogOpen, filePreviewUrl]);

    // Abrir diálogo para adicionar novo exame
    const handleAddExam = () => {
      setCurrentExam({
        id: Date.now().toString(),
        type: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        notes: '',
        results: '',
        file_key: '',
        file_name: '',
        file_type: '',
        uploaded_at: null
      });
      setSelectedFile(null);
      setFileError('');
      setIsDialogOpen(true);
    };
  
    // Abrir diálogo para editar exame existente
    const handleEditExam = (exam) => {
      setCurrentExam({ ...exam });
      setSelectedFile(null);
      setFileError('');
      setIsDialogOpen(true);
    };
  
    // Fechar diálogo de edição
    const handleCloseDialog = () => {
      setIsDialogOpen(false);
      setCurrentExam(null);
      setSelectedFile(null);
      setFileError('');
      setUploadProgress(0);
    };
  
    // Selecionar arquivo para upload
    const handleFileSelect = (event) => {
      const file = event.target.files[0];
      
      if (!file) return;
      
      // Validar arquivo
      const validation = MinioService.validateFile(
        file,
        allowedFileTypes,
        10 // Tamanho máximo de 10MB
      );
      
      if (!validation.valid) {
        setFileError(validation.error);
        setSelectedFile(null);
        event.target.value = null;
        return;
      }
      
      setSelectedFile(file);
      setFileError('');
    };
  
    // Fazer upload do arquivo para o MinIO
    const handleUploadFile = async () => {
      if (!selectedFile) return null;
      
      try {
        setIsUploading(true);
        setUploadProgress(10); // Iniciar progresso
        
        // Simulação de progresso durante upload
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            const next = prev + Math.floor(Math.random() * 15);
            return next > 90 ? 90 : next;
          });
        }, 300);
        
        // Path categorizado por tipo de exame
        const path = `exams/${currentExam.type.replace(/\s+/g, '_').toLowerCase()}`;
        const result = await MinioService.uploadFile(selectedFile, path);
        
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        // Atualizar informações do arquivo no exame atual
        setCurrentExam({
          ...currentExam,
          file_key: result.fileKey,
          file_name: selectedFile.name,
          file_type: selectedFile.type,
          uploaded_at: new Date().toISOString()
        });
        
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
        }, 1000);
        
        return result.fileKey;
      } catch (error) {
        console.error('Erro ao fazer upload:', error);
        setFileError('Falha ao enviar o arquivo. Por favor, tente novamente.');
        setIsUploading(false);
        setUploadProgress(0);
        return null;
      }
    };

      // Salvar exame (novo ou editado)
      const handleSaveExam = async () => {
        if (!currentExam.type || !currentExam.date) {
          setFileError('Por favor, preencha tipo e data do exame.');
          return;
        }
        
        try {
          // Se há arquivo selecionado, fazer upload primeiro
          if (selectedFile) {
            const fileKey = await handleUploadFile();
            if (!fileKey) return; // Upload falhou
          }
          
          // Atualizar estado do formulário
          setFormData(prevData => {
            const updatedExams = [...prevData.exams];
            const existingIndex = updatedExams.findIndex(exam => exam.id === currentExam.id);
            
            if (existingIndex >= 0) {
              // Atualizar exame existente
              updatedExams[existingIndex] = currentExam;
            } else {
              // Adicionar novo exame
              updatedExams.push(currentExam);
            }
            
            return {
              ...prevData,
              exams: updatedExams
            };
          });
          
          handleCloseDialog();
        } catch (error) {
          console.error('Erro ao salvar exame:', error);
          setFileError('Ocorreu um erro ao salvar as informações. Por favor, tente novamente.');
        }
      };
    
      // Confirmar exclusão de exame
      const handleConfirmDelete = (exam) => {
        setExamToDelete(exam);
        setDeleteConfirmOpen(true);
      };
    
      // Excluir exame
      const handleDeleteExam = async () => {
        try {
          // Se o exame tem arquivo, excluir do MinIO
          if (examToDelete.file_key) {
            await MinioService.deleteFile(examToDelete.file_key);
          }
          
          // Atualizar estado removendo o exame
          setFormData(prevData => ({
            ...prevData,
            exams: prevData.exams.filter(exam => exam.id !== examToDelete.id)
          }));
          
          setDeleteConfirmOpen(false);
          setExamToDelete(null);
        } catch (error) {
          console.error('Erro ao excluir exame:', error);
          alert('Ocorreu um erro ao excluir o exame. Por favor, tente novamente.');
        }
      };
    
      // Visualizar arquivo de exame
      const handleViewFile = async (exam) => {
        try {
          if (!exam.file_key) return;
          
          const url = await MinioService.getFileUrl(exam.file_key);
          
          // Se for PDF ou documento, abrir em nova aba
          if (
            exam.file_type === 'application/pdf' ||
            exam.file_type.includes('word') ||
            exam.file_type.includes('excel')
          ) {
            window.open(url, '_blank');
          } else {
            // Se for imagem, mostrar no diálogo
            setFilePreviewUrl(url);
            setPreviewDialogOpen(true);
          }
        } catch (error) {
          console.error('Erro ao visualizar arquivo:', error);
          alert('Não foi possível carregar o arquivo. Por favor, tente novamente.');
        }
      };
    
      // Função auxiliar para formatar a data
      const formatDate = (dateString) => {
        try {
          return format(new Date(dateString), 'dd/MM/yyyy');
        } catch (error) {
          return dateString;
        }
      };

        return (
          <Box>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h5" gutterBottom color="primary">
                Análise de Exames
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary">
                Registre exames laboratoriais e seus resultados. Você pode fazer upload dos arquivos dos exames para referência futura.
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddExam}
                >
                  Adicionar Exame
                </Button>
              </Box>
              
              {formData.exams.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
                  <FolderIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                    Nenhum exame registrado
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Clique em "Adicionar Exame" para incluir resultados de exames laboratoriais
                  </Typography>
                </Paper>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <Grid container spacing={2}>
                    {formData.exams.map((exam) => (
                      <Grid item xs={12} md={6} key={exam.id}>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Card variant="outlined" sx={{ height: '100%' }}>
                            <CardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Typography variant="h6" color="primary" gutterBottom>
                                  {exam.type}
                                </Typography>
                                <Chip 
                                  icon={<DateIcon />} 
                                  label={formatDate(exam.date)} 
                                  size="small" 
                                  color="primary" 
                                  variant="outlined" 
                                />
                              </Box>
                              
                              {exam.results && (
                                <Box sx={{ mt: 1, mb: 2 }}>
                                  <Typography variant="subtitle2" color="text.secondary">
                                    Resultados Principais:
                                  </Typography>
                                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                                    {exam.results}
                                  </Typography>
                                </Box>
                              )}
                              
                              {exam.notes && (
                                <Box sx={{ mt: 1, mb: 2 }}>
                                  <Typography variant="subtitle2" color="text.secondary">
                                    Observações:
                                  </Typography>
                                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                                    {exam.notes}
                                  </Typography>
                                </Box>
                              )}
                              
                              {exam.file_key && (
                                <Box sx={{ mt: 2 }}>
                                  <Chip
                                    icon={<FileIcon />}
                                    label={exam.file_name || 'Arquivo anexado'}
                                    size="small"
                                    color="secondary"
                                    variant="outlined"
                                    onClick={() => handleViewFile(exam)}
                                    sx={{ maxWidth: '100%', overflow: 'hidden' }}
                                  />
                                </Box>
                              )}
                              
                              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                {exam.file_key && (
                                  <IconButton 
                                    size="small" 
                                    color="primary" 
                                    onClick={() => handleViewFile(exam)}
                                    title="Visualizar arquivo"
                                  >
                                    <ViewIcon />
                                  </IconButton>
                                )}
                                <IconButton 
                                  size="small" 
                                  color="primary" 
                                  onClick={() => handleEditExam(exam)}
                                  title="Editar exame"
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton 
                                  size="small" 
                                  color="error" 
                                  onClick={() => handleConfirmDelete(exam)}
                                  title="Excluir exame"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </motion.div>
              )}
            </motion.div>
            
                  {/* Diálogo para adicionar/editar exame */}
                  <Dialog 
                    open={isDialogOpen} 
                    onClose={handleCloseDialog} 
                    fullWidth 
                    maxWidth="md"
                    TransitionComponent={motion.div}
                  >
                    <DialogTitle>
                      {currentExam?.id ? (currentExam.file_key ? 'Editar Exame' : 'Adicionar Exame') : 'Novo Exame'}
                    </DialogTitle>
                    <DialogContent dividers>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth required>
                            <InputLabel id="exam-type-label">Tipo de Exame</InputLabel>
                            <Select
                              labelId="exam-type-label"
                              value={currentExam?.type || ''}
                              onChange={(e) => setCurrentExam({ ...currentExam, type: e.target.value })}
                              label="Tipo de Exame"
                            >
                              <MenuItem value=""><em>Selecione</em></MenuItem>
                              {examTypes.map((type) => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Data do Exame"
                            type="date"
                            value={currentExam?.date || ''}
                            onChange={(e) => setCurrentExam({ ...currentExam, date: e.target.value })}
                            required
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Resultados Principais"
                            multiline
                            rows={4}
                            value={currentExam?.results || ''}
                            onChange={(e) => setCurrentExam({ ...currentExam, results: e.target.value })}
                            placeholder="Registre os valores mais relevantes e seus intervalos de referência (ex: Glicemia: 95 mg/dL (Ref: 70-99 mg/dL))"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Observações e Análise"
                            multiline
                            rows={3}
                            value={currentExam?.notes || ''}
                            onChange={(e) => setCurrentExam({ ...currentExam, notes: e.target.value })}
                            placeholder="Adicione observações importantes sobre os resultados"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Box sx={{ border: '1px dashed #ccc', borderRadius: 1, p: 3 }}>
                            <Typography variant="subtitle1" gutterBottom>
                              Arquivo do Exame
                            </Typography>
                            
                            {currentExam?.file_key ? (
                              <Box sx={{ mb: 2 }}>
                                <Chip
                                  icon={<FileIcon />}
                                  label={currentExam.file_name || 'Arquivo anexado'}
                                  color="secondary"
                                  onDelete={() => setCurrentExam({ ...currentExam, file_key: '', file_name: '', file_type: '', uploaded_at: null })}
                                />
                                <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                                  Para substituir o arquivo atual, exclua-o e faça upload de um novo.
                                </Typography>
                              </Box>
                            ) : (
                              <>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                                  <input
                                    accept={allowedFileTypes.join(',')}
                                    id="exam-file-upload"
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={handleFileSelect}
                                    disabled={isUploading}
                                  />
                                  <label htmlFor="exam-file-upload">
                                    <Button
                                      variant="outlined"
                                      component="span"
                                      startIcon={<UploadIcon />}
                                      disabled={isUploading}
                                    >
                                      Selecionar Arquivo
                                    </Button>
                                  </label>
                                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                                    Formatos aceitos: PDF, JPEG, PNG, TIFF, DOC, DOCX, XLS, XLSX (máx. 10MB)
                                  </Typography>
                                </Box>
                                
                                {selectedFile && (
                                  <Box sx={{ mt: 2 }}>
                                    <Chip
                                      icon={<FileIcon />}
                                      label={selectedFile.name}
                                      variant="outlined"
                                    />
                                    {isUploading && (
                                      <Box sx={{ width: '100%', mt: 1 }}>
                                        <LinearProgress variant="determinate" value={uploadProgress} />
                                        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 0.5 }}>
                                          {uploadProgress < 100 ? 'Enviando...' : 'Concluído!'}
                                        </Typography>
                                      </Box>
                                    )}
                                  </Box>
                                )}
                              </>
                            )}
                            
                            {fileError && (
                              <Alert severity="error" sx={{ mt: 2 }}>
                                {fileError}
                              </Alert>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseDialog}>Cancelar</Button>
                      <Button 
                        onClick={handleSaveExam} 
                        variant="contained" 
                        color="primary"
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>
                            <CircularProgress size={20} sx={{ mr: 1 }} />
                            Enviando...
                          </>
                        ) : 'Salvar'}
                      </Button>
                    </DialogActions>
                  </Dialog>
            
                  {/* Diálogo para visualização de imagens */}
                  <Dialog
                    open={previewDialogOpen}
                    onClose={() => setPreviewDialogOpen(false)}
                    maxWidth="lg"
                    fullWidth
                  >
                    <DialogTitle>Visualização do Exame</DialogTitle>
                    <DialogContent dividers>
                      {filePreviewUrl && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                          <img 
                            src={filePreviewUrl} 
                            alt="Exame" 
                            style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
                          />
                        </Box>
                      )}
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setPreviewDialogOpen(false)}>Fechar</Button>
                      <Button 
                        component="a" 
                        href={filePreviewUrl} 
                        download 
                        target="_blank" 
                        variant="contained"
                      >
                        Download
                      </Button>
                    </DialogActions>
                  </Dialog>
            
                  {/* Diálogo de confirmação para exclusão */}
                  <Dialog
                    open={deleteConfirmOpen}
                    onClose={() => setDeleteConfirmOpen(false)}
                  >
                    <DialogTitle>Confirmar Exclusão</DialogTitle>
                    <DialogContent>
                      <Typography>
                        Tem certeza que deseja excluir este exame? Esta ação não pode ser desfeita.
                      </Typography>
                      {examToDelete?.file_key && (
                        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                          O arquivo associado a este exame também será excluído permanentemente.
                        </Typography>
                      )}
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setDeleteConfirmOpen(false)}>Cancelar</Button>
                      <Button onClick={handleDeleteExam} color="error">
                        Excluir
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Box>
              );
            };
            
            export default LabResults;


