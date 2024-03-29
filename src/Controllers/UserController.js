const { MongoClient, ObjectId } = require('mongodb');
const { mongoURL } = process.env;
// const mongoURL = 'mongodb+srv://DBUSER:PF123@cluster0.x6eafwv.mongodb.net/DB_PF';
const dbName = 'DB_PF';
const collectionName = 'UserDb';


const loadUsersFromDatabase = async () => {
  const client = await MongoClient.connect(mongoURL, { useUnifiedTopology: true });
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  const users = await collection.find({}).toArray();
  client.close();
  return users;
};

const getUsers = async (req, res) => {
  try {
    const users = await loadUsersFromDatabase();
    res.json(users);
  } catch (err) {
    console.error('Error al obtener datos de la base de datos de usuarios:', err);
    res.status(500).send('Error interno del servidor');
  }
};

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
      const users = await loadUsersFromDatabase();
      const user = users.find(user => user._id.toString() === id);
      if (!user) {
        res.status(404).json({ error: 'Usuario no encontrado' });
      } else {
        res.json(user);
      }
    } catch (err) {
      console.error('Error al obtener el usuario por _id:', err);
      res.status(500).send('Error interno del servidor');
    }
  };
  

  const createUser = async (req, res) => {
    const { body } = req;
    try {
      const client = await MongoClient.connect(mongoURL, { useUnifiedTopology: true });
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
  
      const existingUser = await collection.findOne({ email: body.email });
      if (existingUser) {
        res.status(400).json({ message: 'El correo electrónico ya está registrado' });
        client.close();
        return;
      }

      const user = {
        credential: body.credential,
        imagen_de_perfil: body.imagen_de_perfil,
        username: body.username,
        email: body.email,
        password: body.password,
        fecha_de_nacimiento: body.fecha_de_nacimiento,
        rol: body.rol,
        activo: body.activo,
      };
  
      await collection.insertOne(user);
      res.status(201).json({ message: 'Usuario creado exitosamente' });
      client.close();
    } catch (err) {
      console.error('Error al crear el usuario:', err);
      res.status(500).send('Error interno del servidor');
    }
  };

const updateUser = async (req, res) => {
  const { body, params } = req;
  const { id } = params;
  try {
    const client = await MongoClient.connect(mongoURL, { useUnifiedTopology: true });
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const existingUser = await collection.findOne({ _id: new ObjectId(id) });
    if (!existingUser) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }
    const updatedUser = {
      username: body.username || existingUser.username,
      email: body.email || existingUser.email,
      password: body.password || existingUser.password,
      fecha_de_nacimiento: body.fecha_de_nacimiento || existingUser.fecha_de_nacimiento,
      rol: body.rol || existingUser.rol,
      activo: body.activo || existingUser.activo,
      imagen_de_perfil: body.imagen_de_perfil || existingUser.imagen_de_perfil,
      Nickname :  body.Nickname || existingUser.Nickname,
      edad :  body.edad || existingUser.edad,
      genres :  body.genres || existingUser.genres,
      apodo :  body. apodo || existingUser. apodo,
     
    };
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: updatedUser });
    res.status(200).json({ message: 'Usuario actualizado exitosamente', updatedUser });
    client.close();
  } catch (err) {
    console.error('Error al actualizar el usuario:', err);
    res.status(500).send('Error interno del servidor');
  }
};

const getUserByEmail = async (req, res) => {
  const { email } = req.query; 
  try {
    const client = await MongoClient.connect(mongoURL, { useUnifiedTopology: true });
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const user = await collection.findOne({ email });
    client.close();

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (err) {
    console.error('Error al obtener el usuario por email:', err);
    res.status(500).send('Error interno del servidor');
  }
};

const enableUser = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await MongoClient.connect(mongoURL, { useUnifiedTopology: true });
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    await collection.updateOne({ _id: new ObjectId(id) }, { $set: { activo: true } });
    res.status(200).json({ message: 'Usuario habilitado exitosamente' });
    client.close();
  } catch (err) {
    console.error('Error al habilitar el usuario:', err);
    res.status(500).send('Error interno del servidor');
  }
};

const disableUser = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await MongoClient.connect(mongoURL, { useUnifiedTopology: true });
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    await collection.updateOne({ _id: new ObjectId(id) }, { $set: { activo: false } });
    res.status(200).json({ message: 'Usuario deshabilitado exitosamente' });
    client.close();
  } catch (err) {
    console.error('Error al deshabilitar el usuario:', err);
    res.status(500).send('Error interno del servidor');
  }
};


const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { rol} = req.body;

  try {
    const client = await MongoClient.connect(mongoURL, { useUnifiedTopology: true });
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const existingUser = await collection.findOne({ _id: new ObjectId(id) });

    if (!existingUser) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    await collection.updateOne({ _id: new ObjectId(id) }, { $set: { rol } });

    res.status(200).json({ message: 'Rol de usuario actualizado exitosamente', rol});
    client.close();
  } catch (err) {
    console.error('Error al actualizar el rol del usuario:', err);
    res.status(500).send('Error interno del servidor');
  }
};

const getUserRoles = async (req, res) => {
  try {
    const client = await MongoClient.connect(mongoURL, { useUnifiedTopology: true });
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Obtén todos los usuarios y sus roles
    const users = await collection.find({}).toArray();
    const userRoles = users.map(user => ({ _id: user._id, rol: user.rol }));

    client.close();

    res.json(userRoles);
  } catch (err) {
    console.error('Error al obtener los roles de usuario:', err);
    res.status(500).send('Error interno del servidor');
  }
};



module.exports = { getUsers, getUserById, createUser, updateUser, getUserByEmail, enableUser, disableUser, updateUserRole, getUserRoles};
