const ConsultaService = require('../services/consultaService');

const ConsultaController = {

  createConsulta: async (req, res) => {
    try {
      const consulta = await ConsultaService.createConsulta(req.body);
      return res.status(201).json(consulta);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  getAllConsultas: async (req, res) => {
    try {
      const consultas = await ConsultaService.getAllConsulta(); 
      return res.status(200).json(consultas);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  getConsultaById: async (req, res) => {
    try {
      const { id } = req.params;
      const consulta = await ConsultaService.getConsultaById(id);
      if (!consulta) return res.status(404).json({ error: 'Consulta not found' });
      return res.status(200).json(consulta);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  updateConsulta: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await ConsultaService.updateConsulta(id, req.body);
      const affected = Array.isArray(result) ? result[0] : result;
      if (!affected) return res.status(404).json({ error: 'Consulta not found' });
      return res.status(200).json({ message: 'Consulta updated successfully' });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  deleteConsulta: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await ConsultaService.deleteConsulta(id); 
      if (!deleted) return res.status(404).json({ error: 'Consulta not found' });
      return res.status(200).json({ message: 'Consulta deleted successfully' });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

};

module.exports = ConsultaController;