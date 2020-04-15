const db = require('../data/db-config.js');

module.exports = {
    find,
    findById,
    findSteps,
    add,
    update,
    remove,
    addStep
}

function find() {
    // SELECT * FROM schemes
    return db('schemes');
}

function findById(id) {
    // SELECT * FROM schemes WHERE schemes.id = id
    return db('schemes').where({ id }).first();
}

function findSteps(id) {
    // in sql: 
    // SELECT st.*, sch.scheme_name FROM schemes sch JOIN steps st ON sch.id = st.scheme_id WHERE schemes.id = id
    return db.select('steps.id'
        , 'schemes.scheme_name'
        , 'steps.step_number'
        , 'steps.instructions')
        .from('schemes')
        .join('steps', 'schemes.id', 'steps.scheme_id')
        .where('schemes.id', id)
        .orderBy('steps.step_number')
}

function add(scheme) {
    return db('schemes')
        .insert(scheme, 'id')
        .then(([id]) => {
            return findById(id)
        })
}

function update(changes, id) {
    return db('schemes').where({ id }).update(changes)
    .then(() => {
        return findById(id)
    })
}

function remove(id) {
    return findById(id)
        .then(schemeToDelete => {
            return db('schemes').where({ id }).del()
                .then(() => schemeToDelete)
        })
}

// *** STRETCH *** //
function addStep(step, scheme_id) {
    //takes step object & scheme id
    //inserts step into db, correctly linking it to the intended schema
    // const id = { scheme_id: scheme_id }
    return db('steps').insert({...step, scheme_id})
        .then(ids => {
            const newStepId = ids[0]
            return db('steps').where('steps.id', newStepId)
        })
}