// src/controllers/ConsultaController.js
const Consulta = require('../models/Consulta');

const ConsultaController = {
    createConsulta: async (req, res) => {
        try {
            const { professionalId, especialidade, data, horario } = req.body;
            const userId = req.user.id; // obtido do token pelo authMiddleware

            if (!professionalId || !especialidade || !data || !horario) {
                return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
            }

            const novaConsulta = await Consulta.create({
                userId,
                professionalId,
                especialidade,
                data,
                horario
            });

            res.status(201).json(novaConsulta);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    getConsultasByUsuario: async (req, res) => {
        try {
            const userId = req.params.userId;
            const consultas = await Consulta.find({ userId })
                .populate({
                    path: 'professionalId',
                    populate: { path: 'userId', select: 'name' }
                })
                .sort({ createdAt: -1 });

            // Formata o retorno para o padrão esperado pelo frontend
            const formatadas = consultas.map(c => {
                // Converte YYYY-MM-DD para DD/MM/YYYY
                const [ano, mes, dia] = c.data.split('-');
                const dataFormatada = dia ? `${dia}/${mes}/${ano}` : c.data;

                return {
                    _id: c._id,
                    especialidade: c.especialidade,
                    medico: c.professionalId?.userId?.name || 'Profissional da Saúde',
                    status: c.status,
                    data: dataFormatada,
                    horario: c.horario
                };
            });

            res.status(200).json(formatadas);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    cancelConsulta: async (req, res) => {
        try {
            const consultaId = req.params.id;
            const userId = req.user.id;

            const consulta = await Consulta.findById(consultaId).populate('professionalId');
            if (!consulta) {
                return res.status(404).json({ error: 'Consulta não encontrada.' });
            }

            if (consulta.userId.toString() !== userId) {
                return res.status(403).json({ error: 'Não autorizado.' });
            }

            if (consulta.status === 'Cancelada') {
                return res.status(400).json({ error: 'Consulta já está cancelada.' });
            }

            // Validação de 24h de antecedência
            const dataHoraConsulta = new Date(`${consulta.data}T${consulta.horario}:00`);
            const diffMs = dataHoraConsulta.getTime() - Date.now();
            const diffHours = diffMs / (1000 * 60 * 60);

            let multa = 0;
            let mensagem = 'Consulta cancelada com sucesso sem custo adicional.';

            if (diffHours < 24) {
                const valorSessao = consulta.professionalId?.pricePerHour || 0;
                multa = valorSessao * 0.30;
                mensagem = `Consulta cancelada com sucesso. Foi aplicada uma multa de 30% (R$ ${multa.toFixed(2).replace('.', ',')}) devido à antecedência inferior a 24 horas.`;
            }

            consulta.status = 'Cancelada';
            consulta.multaAplicada = multa;
            await consulta.save();

            res.status(200).json({ message: mensagem, consulta });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    rescheduleConsulta: async (req, res) => {
        try {
            const consultaId = req.params.id;
            const userId = req.user.id;
            const { data, horario } = req.body;

            if (!data || !horario) {
                return res.status(400).json({ error: 'Data e horário são obrigatórios.' });
            }

            const consulta = await Consulta.findById(consultaId);
            if (!consulta) {
                return res.status(404).json({ error: 'Consulta não encontrada.' });
            }

            if (consulta.userId.toString() !== userId) {
                return res.status(403).json({ error: 'Não autorizado.' });
            }

            if (consulta.status === 'Cancelada') {
                return res.status(400).json({ error: 'Não é possível reagendar uma consulta cancelada.' });
            }

            // Validação de 24h de antecedência (data/hora original)
            const dataHoraOriginal = new Date(`${consulta.data}T${consulta.horario}:00`);
            const diffMs = dataHoraOriginal.getTime() - Date.now();
            const diffHours = diffMs / (1000 * 60 * 60);

            if (diffHours < 24) {
                return res.status(400).json({ 
                    error: 'Consultas só podem ser reagendadas com pelo menos 24 horas de antecedência.' 
                });
            }

            // Validação de 24h para a nova data (deve ser no futuro)
            const novaDataHora = new Date(`${data}T${horario}:00`);
            if (novaDataHora.getTime() < Date.now()) {
                return res.status(400).json({ error: 'A nova data deve ser um horário futuro.' });
            }

            consulta.data = data;
            consulta.horario = horario;
            await consulta.save();

            res.status(200).json({ message: 'Consulta reagendada com sucesso.', consulta });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = ConsultaController;
