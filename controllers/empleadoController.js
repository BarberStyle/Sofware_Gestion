const Empleado = require('../models/Empleado');
const bcryptjs = require('bcryptjs');

const { validationResult } = require('express-validator');


//registra empleados en la bd
exports.crearEmpleado = async (req, res) => {

    //revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    const { documento, contrasena } = req.body;

    try {

        //Revisar usuario regitrado unico
        let empleado = await Empleado.findOne({ documento });

        if (empleado) {
            return res.status(400).json({ msg: 'El Empleado ya existe' });
        }

        //crea el nuevo Empleado
        empleado = new Empleado(req.body);

        //hashear el password
        const salt = await bcryptjs.genSalt(10);
        empleado.contrasena = await bcryptjs.hash(contrasena, salt);


        //guarda en bd
        await empleado.save();

        res.json(empleado);
    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }


}

//consulta todos los empleados registados en la bd
exports.obtenerEmpleados = async (req, res) => {
    try {
        const empleados = await Empleado.find({});
        res.json({ empleados });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}


//eliminar un empleado
exports.eliminarEmpleado = async (req, res) => {

    //reviar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    var empleadoId = req.params.id;

    Empleado.findByIdAndRemove(empleadoId, (err, empleadoEliminado) => {
        if (err) return res.status(500).send({ message: 'No se ha podido borrar el empleado' });

        if (!empleadoEliminado) return res.status(404).send({ message: "No se puede eliminar ese empleado." });

        return res.status(200).send({
            empleado: empleadoEliminado
        });
    });
}


// Actualizar empleado
exports.actualizarEmpleado = async (req, res) => {

    //reviar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    var empleadoId = req.params.id;
    var update = req.body;

    Empleado.findByIdAndUpdate(empleadoId, update, { new: true }, (err, empleadoActualizado) => {
        if (err) return res.status(500).send({ message: 'Error al actualizar' });

        if (!empleadoActualizado) return res.status(404).send({ message: 'No existe el empleado para actualizar' });

        return res.status(200).send({
            empleado: empleadoActualizado
        });
    });

}
