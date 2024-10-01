// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './Group.css'; // Import des styles
// import { toast } from "react-toastify";

// function Group() {
//   const [groups, setGroups] = useState([]);  // État pour les groupes
//   const [newGroupName, setNewGroupName] = useState(''); // Nouveau groupe
//   const [newGroupDescription, setNewGroupDescription] = useState('');
//   const [selectedGroup, setSelectedGroup] = useState(null); // Groupe sélectionné
//   const [messages, setMessages] = useState([]); // Messages du groupe sélectionné
//   const [newMessage, setNewMessage] = useState(''); // Nouveau message
//   const [showCreateGroupForm, setShowCreateGroupForm] = useState(false); // Afficher le formulaire de création de groupe
//   const [file, setFile] = useState(null); // Fichier/image à envoyer
//   const [inviteName, setInviteName] = useState(''); // Nom de l'utilisateur à inviter
//   const [inviteEmail, setInviteEmail] = useState(''); // Email de l'utilisateur à inviter

//   const navigate = useNavigate(); // Pour rediriger vers la page de login

//   // Fonction pour récupérer les groupes depuis l'API
//   const fetchGroups = async () => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       toast.error("Non authentifié. Veuillez vous connecter.");
//       navigate("/login");  // Rediriger vers la page de connexion si le token est manquant
//       return;
//     }

//     try {
//       const response = await axios.get('http://127.0.0.1:8000/api/groups', {
//         headers: {
//           "Authorization": `Bearer ${token}`
//         }
//       });
//       setGroups(response.data);  // Mise à jour des groupes
//     } catch (error) {
//       console.error("Erreur lors de la récupération des groupes:", error);
//       if (error.response && error.response.status === 401) {
//         toast.error("Session expirée. Veuillez vous reconnecter.");
//         navigate("/login");
//       }
//     }
//   };

//   // Chargement des groupes au montage du composant
//   useEffect(() => {
//     fetchGroups();  // Charger les groupes
//   }, []);

//   // Fonction pour créer un nouveau groupe
//   const addGroup = async () => {
//     const token = localStorage.getItem("token");

//     if (!newGroupName || !newGroupDescription || !token) {
//       alert("Veuillez remplir tous les champs.");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         'http://127.0.0.1:8000/api/groups', // Endpoint pour créer un groupe
//         {
//           name: newGroupName,           // Nom du groupe
//           description: newGroupDescription, // Description du groupe
//         },
//         {
//           headers: {
//             "Authorization": `Bearer ${token}`
//           }
//         }
//       );
//       console.log("Groupe créé avec succès :", response.data);
//       setGroups([...groups, response.data]);  // Ajouter le groupe créé à la liste des groupes
//       setShowCreateGroupForm(false);          // Masquer le formulaire
//     } catch (error) {
//       console.error("Erreur lors de la création du groupe:", error);
//       alert("Erreur lors de la création du groupe.");
//     }
//   };

//   // Sélection d'un groupe
//   const handleGroupSelect = (group) => {
//     setSelectedGroup(group);
//     setMessages([{ id: 1, text: 'Bienvenue dans le groupe ' + group.name }]);

//     console.log("ID du groupe sélectionné:", group.id);
//   };

//   // Fonction pour uploader un fichier
//   const uploadFile = async (file) => {
//     const token = localStorage.getItem("token");
//     if (!file || !selectedGroup || !token) return;

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await axios.post(
//         `http://127.0.0.1:8000/api/groups/${selectedGroup.id}/files`, 
//         formData, 
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//             "Authorization": `Bearer ${token}`
//           }
//         }
//       );
//       return response.data.file_url; // Retourner l'URL du fichier uploadé
//     } catch (error) {
//       console.error("Erreur lors de l'upload du fichier:", error);
//       return null; // Retourner null en cas d'erreur
//     }
//   };

//   // Fonction pour envoyer un message
//   const sendMessage = async () => {
//     if (newMessage.trim() === '' && !file) return;

//     const previousFile = file;
//     setFile(null);

//     let uploadedFileUrl = null;
//     if (previousFile) {
//       uploadedFileUrl = await uploadFile(previousFile);
//     }

//     const messageToSend = {
//       id: messages.length + 1,
//       text: newMessage,
//       file: uploadedFileUrl,  // Ajouter l'URL du fichier
//     };

//     setMessages([...messages, messageToSend]);
//     setNewMessage('');
//   };

//   // Gestion du changement de fichier
//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   // Fonction pour inviter un utilisateur par email
//   const inviteUserToGroup = async () => {
//     const token = localStorage.getItem("token");

//     if (!inviteName || !inviteEmail || !selectedGroup || !token) {
//       alert("Veuillez entrer un nom, un email et sélectionner un groupe.");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `http://127.0.0.1:8000/api/groups/${selectedGroup.id}/members`,  // URL d'invitation avec groupId
//         {
//           name: inviteName,
//           email: inviteEmail,
//           groupe_id: selectedGroup.id
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             "Authorization": `Bearer ${token}`
//           }
//         }
//       );

//       console.log("Invitation envoyée avec succès :", response.data);
//       alert(`Invitation envoyée à ${inviteEmail}`);

//       setInviteName('');
//       setInviteEmail('');
//     } catch (error) {
//       if (error.response && error.response.status === 422) {
//         alert("Cet email a déjà été invité.");
//       } else {
//         console.error("Erreur lors de l'invitation de l'utilisateur:", error);
//         alert("Erreur lors de l'envoi de l'invitation.");
//       }
//     }
//   };

//   return (
//     <div>
//       {/* Affichage des groupes */}
//       <div>
//         <h2>Vos Groupes</h2>
//         <ul>
//           {groups.map((group) => (
//             <li key={group.id} onClick={() => handleGroupSelect(group)}>
//               {group.name}
//             </li>
//           ))}
//         </ul>

//         <button onClick={() => setShowCreateGroupForm(true)}>Créer un Groupe</button>

//         {showCreateGroupForm && (
//           <div>
//             <h3>Nouveau Groupe</h3>
//             <input
//               type="text"
//               placeholder="Nom du groupe"
//               value={newGroupName}
//               onChange={(e) => setNewGroupName(e.target.value)}
//             />
//             <input
//               type="text"
//               placeholder="Description du groupe"
//               value={newGroupDescription}
//               onChange={(e) => setNewGroupDescription(e.target.value)}
//             />
//             <button onClick={addGroup}>Créer</button>
//           </div>
//         )}
//       </div>

//       {/* Affichage du groupe sélectionné */}
//       {selectedGroup && (
//         <div>
//           <h2>Messages du groupe {selectedGroup.name}</h2>
//           <ul>
//             {messages.map((message) => (
//               <li key={message.id}>
//                 {message.text}
//                 {message.file && <img src={message.file} alt="Uploaded" />}
//               </li>
//             ))}
//           </ul>

//           {/* Envoi de message et de fichier */}
//           <input
//             type="text"
//             placeholder="Écrire un message..."
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//           />
//           <input type="file" onChange={handleFileChange} />
//           <button onClick={sendMessage}>Envoyer</button>

//           {/* Formulaire d'invitation */}
//           <div>
//             <h3>Inviter un membre</h3>
//             <input
//               type="text"
//               placeholder="Nom"
//               value={inviteName}
//               onChange={(e) => setInviteName(e.target.value)}
//             />
//             <input
//               type="email"
//               placeholder="Email"
//               value={inviteEmail}
//               onChange={(e) => setInviteEmail(e.target.value)}
//             />
//             <button onClick={inviteUserToGroup}>Inviter</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Group;










// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './Group.css'; // Assuming you'll add custom styles here if needed
// import { toast } from "react-toastify";

// function Group() {
//   const [groups, setGroups] = useState([]);
//   const [newGroupName, setNewGroupName] = useState('');
//   const [newGroupDescription, setNewGroupDescription] = useState('');
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [showCreateGroupForm, setShowCreateGroupForm] = useState(false);
//   const [file, setFile] = useState(null);
//   const [inviteName, setInviteName] = useState('');
//   const [inviteEmail, setInviteEmail] = useState('');

//   const navigate = useNavigate();

//   // Fetch the list of groups on component mount
//   useEffect(() => {
//     fetchGroups();
//   }, []);

//   const fetchGroups = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("Non authentifié. Veuillez vous connecter.");
//       navigate("/login");
//       return;
//     }

//     try {
//       const response = await axios.get('http://127.0.0.1:8000/api/groups', {
//         headers: { "Authorization": `Bearer ${token}` }
//       });
//       setGroups(response.data);
//     } catch (error) {
//       console.error("Erreur lors de la récupération des groupes:", error);
//       if (error.response && error.response.status === 401) {
//         toast.error("Session expirée. Veuillez vous reconnecter.");
//         navigate("/login");
//       }
//     }
//   };

//   const addGroup = async () => {
//     const token = localStorage.getItem("token");

//     if (!newGroupName || !newGroupDescription || !token) {
//       alert("Veuillez remplir tous les champs.");
//       return;
//     }

//     try {
//       const response = await axios.post('http://127.0.0.1:8000/api/groups', {
//         name: newGroupName,
//         description: newGroupDescription,
//       }, {
//         headers: { "Authorization": `Bearer ${token}` }
//       });

//       setGroups([...groups, response.data]);
//       setShowCreateGroupForm(false);
//     } catch (error) {
//       console.error("Erreur lors de la création du groupe:", error);
//       alert("Erreur lors de la création du groupe.");
//     }
//   };

//   const handleGroupSelect = (group) => {
//     setSelectedGroup(group);
//     setMessages([{ id: 1, text: 'Bienvenue dans le groupe ' + group.name }]);
//   };

//   const sendMessage = async () => {
//     if (newMessage.trim() === '' && !file) return;
    
//     const uploadedFileUrl = file ? await uploadFile(file) : null;

//     const messageToSend = {
//       id: messages.length + 1,
//       text: newMessage,
//       file: uploadedFileUrl,
//     };

//     setMessages([...messages, messageToSend]);
//     setNewMessage('');
//     setFile(null);
//   };

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };
  

//   const uploadFile = async (file) => {
//     const token = localStorage.getItem("token");
//     if (!file || !selectedGroup || !token) return;
  
//     const formData = new FormData();
//     formData.append('file_name', file); // Ajout du fichier avec son nom
//     formData.append('groupe_id', selectedGroup.id); // Ajout de l'ID du groupe
  
//     try {
//       const response = await axios.post(
//         `http://127.0.0.1:8000/api/groups/${selectedGroup.id}/files`, 
//         formData, 
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//             "Authorization": `Bearer ${token}`
//           }
//         }
//       );
//       return response.data.fichier.file_name; // Retourne le nom du fichier uploadé
//     } catch (error) {
//       console.error("Erreur lors de l'upload du fichier:", error);
//       return null;
//     }
//   };
  

//   const inviteUserToGroup = async () => {
//     const token = localStorage.getItem("token");

//     if (!inviteName || !inviteEmail || !selectedGroup || !token) {
//       alert("Veuillez entrer un nom, un email et sélectionner un groupe.");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `http://127.0.0.1:8000/api/groups/${selectedGroup.id}/members`,  // URL d'invitation avec groupId
//         {
//           name: inviteName,
//           email: inviteEmail,
//           groupe_id: selectedGroup.id
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             "Authorization": `Bearer ${token}`
//           }
//         }
//       );

//       alert(`Invitation envoyée à ${inviteEmail}`);
//       setInviteName('');
//       setInviteEmail('');
//     } catch (error) {
//       if (error.response && error.response.status === 422) {
//         alert("Cet email a déjà été invité.");
//       } else {
//         console.error("Erreur lors de l'invitation de l'utilisateur:", error);
//         alert("Erreur lors de l'envoi de l'invitation.");
//       }
//     }
//   };

//   return (
//     <div>
//       {/* Group List */}
//       <div>
//         <h2>Vos Groupes</h2>
//         <ul>
//           {groups.map((group) => (
//             <li key={group.id} onClick={() => handleGroupSelect(group)}>
//               {group.name}
//             </li>
//           ))}
//         </ul>

//         <button onClick={() => setShowCreateGroupForm(true)}>Créer un Groupe</button>

//         {showCreateGroupForm && (
//           <div>
//             <h3>Nouveau Groupe</h3>
//             <input
//               type="text"
//               placeholder="Nom du groupe"
//               value={newGroupName}
//               onChange={(e) => setNewGroupName(e.target.value)}
//             />
//             <input
//               type="text"
//               placeholder="Description du groupe"
//               value={newGroupDescription}
//               onChange={(e) => setNewGroupDescription(e.target.value)}
//             />
//             <button onClick={addGroup}>Créer</button>
//           </div>
//         )}
//       </div>

//       {/* Selected Group Messages */}
//       {selectedGroup && (
//         <div>
//           <h2>Messages du groupe {selectedGroup.name}</h2>
//           <ul>
//             {messages.map((message) => (
//               <li key={message.id}>
//                 {message.text}
//                 {message.file && <img src={message.file} alt="Uploaded" />}
//               </li>
//             ))}
//           </ul>

//           {/* Message Input and File Upload */}
//           <input
//             type="text"
//             placeholder="Écrire un message..."
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//           />
//           <input type="file" onChange={handleFileChange} />
//           <button onClick={sendMessage}>Envoyer</button>

//           {/* User Invitation */}
//           <div>
//             <h3>Inviter un membre</h3>
//             <input
//               type="text"
//               placeholder="Nom"
//               value={inviteName}
//               onChange={(e) => setInviteName(e.target.value)}
//             />
//             <input
//               type="email"
//               placeholder="Email"
//               value={inviteEmail}
//               onChange={(e) => setInviteEmail(e.target.value)}
//             />
//             <button onClick={inviteUserToGroup}>Inviter</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Group;




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './Group.css'; // Assuming you'll add custom styles here if needed
// import { toast } from "react-toastify";

// function Group() {
//   const [groups, setGroups] = useState([]);
//   const [newGroupName, setNewGroupName] = useState('');
//   const [newGroupDescription, setNewGroupDescription] = useState('');
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [files, setFiles] = useState([]); // Nouvelle liste de fichiers
//   const [newMessage, setNewMessage] = useState('');
//   const [showCreateGroupForm, setShowCreateGroupForm] = useState(false);
//   const [file, setFile] = useState(null);
//   const [inviteName, setInviteName] = useState('');
//   const [inviteEmail, setInviteEmail] = useState('');

//   const navigate = useNavigate();

//   // Fetch the list of groups on component mount
//   useEffect(() => {
//     fetchGroups();
//   }, []);

//   const fetchGroups = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("Non authentifié. Veuillez vous connecter.");
//       navigate("/login");
//       return;
//     }

//     try {
//       const response = await axios.get('http://127.0.0.1:8000/api/getGroups', {
//         headers: { "Authorization": `Bearer ${token}` }
//       });
//       setGroups(response.data);
//     } catch (error) {
//       console.error("Erreur lors de la récupération des groupes:", error);
//       if (error.response && error.response.status === 401) {
//         toast.error("Session expirée. Veuillez vous reconnecter.");
//         navigate("/login");
//       }
//     }
//   };

//   const addGroup = async () => {
//     const token = localStorage.getItem("token");

//     if (!newGroupName || !newGroupDescription || !token) {
//       alert("Veuillez remplir tous les champs.");
//       return;
//     }

//     try {
//       const response = await axios.post('http://127.0.0.1:8000/api/groups', {
//         name: newGroupName,
//         description: newGroupDescription,
//       }, {
//         headers: { "Authorization": `Bearer ${token}` }
//       });

//       setGroups([...groups, response.data]);
//       setShowCreateGroupForm(false);
//     } catch (error) {
//       console.error("Erreur lors de la création du groupe:", error);
//       alert("Erreur lors de la création du groupe.");
//     }
//   };

//   const handleGroupSelect = async (group) => {
//     setSelectedGroup(group);
  
//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("Non authentifié. Veuillez vous connecter.");
//       navigate("/login");
//       return;
//     }
  
//     try {
//       // Utilisation de la bonne URL
//       const response = await axios.get(`http://127.0.0.1:8000/api/getGroups`, {
//         headers: { "Authorization": `Bearer ${token}` }
//       });
  
//       // Filtrer les données pour obtenir les messages et fichiers du groupe sélectionné
//       const groupData = response.data.find(g => g.id === group.id);
  
//       if (groupData) {
//         const { messages = [], fichiers = [] } = groupData; // Définit des tableaux vides par défaut
  
//         // Mappe les messages et fichiers si disponibles
//         const formattedMessages = messages.map(message => ({
//           id: message.id,
//           text: message.text,
//           uploadedBy: message.name // Si le nom de la personne est inclus dans la réponse des messages
//         }));
  
//         const formattedFiles = fichiers.map(fichier => ({
//           id: fichier.id,
//           filePath: fichier.file_path,
//           uploadedBy: fichier.uploaded_by || 'Inconnu'
//         }));
  
//         // Ajout des messages et fichiers à l'état
//         setMessages(formattedMessages);
//         setFiles(formattedFiles); // Mise à jour des fichiers
//       } else {
//         setMessages([]); // S'il n'y a pas de groupeData, on met des valeurs vides
//         setFiles([]);
//       }
//     } catch (error) {
//       console.error("Erreur lors de la récupération des messages et fichiers:", error);
//       toast.error("Erreur lors de la récupération des messages et fichiers.");
//     }
//   };
  

//   const sendMessage = async () => {
//     if (newMessage.trim() === '' && !file) return;

//     const uploadedFileUrl = file ? await uploadFile(file) : null;
//     const userName = localStorage.getItem("userName"); // Assumes you store the username in local storage

//     const messageToSend = {
//       id: messages.length + 1,
//       text: newMessage,
//       file: uploadedFileUrl,
//       uploadedBy: userName // Store the user's name with the message
//     };

//     setMessages([...messages, messageToSend]);
//     setNewMessage('');
//     setFile(null);
//   };

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const uploadFile = async (file) => {
//     const token = localStorage.getItem("token");
//     if (!file || !selectedGroup || !token) return;

//     const formData = new FormData();
//     formData.append('file_name', file); // Ajout du fichier avec son nom
//     formData.append('groupe_id', selectedGroup.id); // Ajout de l'ID du groupe

//     try {
//       const response = await axios.post(
//         `http://127.0.0.1:8000/api/groups/${selectedGroup.id}/files`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//             "Authorization": `Bearer ${token}`
//           }
//         }
//       );
//       // Assuming response has user info
//       const { file_name, uploaded_by } = response.data.fichier;
//       return { file_name, uploaded_by }; // Return both file name and uploader
//     } catch (error) {
//       console.error("Erreur lors de l'upload du fichier:", error);
//       return null;
//     }
//   };

//   const inviteUserToGroup = async () => {
//     const token = localStorage.getItem("token");

//     if (!inviteName || !inviteEmail || !selectedGroup || !token) {
//       alert("Veuillez entrer un nom, un email et sélectionner un groupe.");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `http://127.0.0.1:8000/api/groups/${selectedGroup.id}/members`,  // URL d'invitation avec groupId
//         {
//           name: inviteName,
//           email: inviteEmail,
//           groupe_id: selectedGroup.id
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             "Authorization": `Bearer ${token}`
//           }
//         }
//       );

//       alert(`Invitation envoyée à ${inviteEmail}`);
//       setInviteName('');
//       setInviteEmail('');
//     } catch (error) {
//       if (error.response && error.response.status === 422) {
//         alert("Cet email a déjà été invité.");
//       } else {
//         console.error("Erreur lors de l'invitation de l'utilisateur:", error);
//         alert("Erreur lors de l'envoi de l'invitation.");
//       }
//     }
//   };

//   return (
//     <div>
//       {/* Group List */}
//       <div>
//         <h2>Vos Groupes</h2>
//         <ul>
//           {groups.map((group) => (
//             <li key={group.id} onClick={() => handleGroupSelect(group)}>
//               {group.name}
//             </li>
//           ))}
//         </ul>

//         <button onClick={() => setShowCreateGroupForm(true)}>Créer un Groupe</button>

//         {showCreateGroupForm && (
//           <div>
//             <h3>Nouveau Groupe</h3>
//             <input
//               type="text"
//               placeholder="Nom du groupe"
//               value={newGroupName}
//               onChange={(e) => setNewGroupName(e.target.value)}
//             />
//             <input
//               type="text"
//               placeholder="Description du groupe"
//               value={newGroupDescription}
//               onChange={(e) => setNewGroupDescription(e.target.value)}
//             />
//             <button onClick={addGroup}>Créer</button>
//           </div>
//         )}
//       </div>

//       {/* Selected Group Messages */}
//       {selectedGroup && (
//         <div>
//           <h2>Messages du groupe {selectedGroup.name}</h2>
//           <ul>
//             {messages.map((message) => (
//               <li key={message.id}>
//                 {message.text}
//                 <p>Envoyé par: {message.uploadedBy}</p>

//                 {/* Liste des fichiers associés */}
//                 {files.map((file) => (
//                   <div key={file.id}>
//                     <p>Fichier: {file.filePath}</p>
//                     <p>Envoyé par: {file.uploadedBy}</p>
//                   </div>
//                 ))}
//               </li>
//             ))}
//           </ul>

//           {/* Message Input and File Upload */}
//           <input
//             type="text"
//             placeholder="Écrire un message..."
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//           />
//           <input type="file" onChange={handleFileChange} />
//           <button onClick={sendMessage}>Envoyer</button>

//           {/* User Invitation */}
//           <div>
//             <h3>Inviter un utilisateur</h3>
//             <input
//               type="text"
//               placeholder="Nom"
//               value={inviteName}
//               onChange={(e) => setInviteName(e.target.value)}
//             />
//             <input
//               type="email"
//               placeholder="Email"
//               value={inviteEmail}
//               onChange={(e) => setInviteEmail(e.target.value)}
//             />
//             <button onClick={inviteUserToGroup}>Inviter</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Group;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Group.css';
import { toast } from "react-toastify";

function Group() {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [files, setFiles] = useState([]); // État pour les fichiers
  const [newMessage, setNewMessage] = useState('');
  const [showCreateGroupForm, setShowCreateGroupForm] = useState(false);
  const [file, setFile] = useState(null);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  const navigate = useNavigate();

  // Fetch the list of groups on component mount
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Non authentifié. Veuillez vous connecter.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get('http://127.0.0.1:8000/api/groups', {
        headers: { "Authorization": `Bearer ${token}` }
      });
      setGroups(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des groupes:", error);
      if (error.response && error.response.status === 401) {
        toast.error("Session expirée. Veuillez vous reconnecter.");
        navigate("/login");
      }
    }
  };

  const handleGroupSelect = async (group) => {
    setSelectedGroup(group);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Non authentifié. Veuillez vous connecter.");
      navigate("/login");
      return;
    }

    try {
      // Récupération des messages et fichiers du groupe
      const response = await axios.get(`http://127.0.0.1:8000/api/getGroups`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      const groupData = response.data.find(g => g.id === group.id);

      if (groupData) {
        const { messages = [], fichiers = [] } = groupData;

        const formattedMessages = messages.map(message => ({
          id: message.id,
          text: message.text,
          uploadedBy: message.name
        }));

        const formattedFiles = fichiers.map(fichier => ({
          id: fichier.id,
          filePath: fichier.file_path,
          uploadedBy: fichier.uploaded_by || 'Inconnu'
        }));

        setMessages(formattedMessages);
        setFiles(formattedFiles);
      } else {
        setMessages([]);
        setFiles([]);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des messages et fichiers:", error);
      toast.error("Erreur lors de la récupération des messages et fichiers.");
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() === '' && !file) return;

    const uploadedFileUrl = file ? await uploadFile(file) : null;
    const userName = localStorage.getItem("userName");

    const messageToSend = {
      id: messages.length + 1,
      text: newMessage,
      file: uploadedFileUrl,
      uploadedBy: userName
    };

    setMessages([...messages, messageToSend]);
    setNewMessage('');
    setFile(null);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async (file) => {
    const token = localStorage.getItem("token");
    if (!file || !selectedGroup || !token) return;

    const formData = new FormData();
    formData.append('file_name', file);
    formData.append('groupe_id', selectedGroup.id);

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/groups/${selectedGroup.id}/files`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            "Authorization": `Bearer ${token}`
          }
        }
      );
      const { file_name, uploaded_by } = response.data.fichier;
      return { file_name, uploaded_by };
    } catch (error) {
      console.error("Erreur lors de l'upload du fichier:", error);
      return null;
    }
  };

  // Fonction pour inviter un membre au groupe
  const inviteUserToGroup = async () => {
    if (!inviteName || !inviteEmail || !selectedGroup) {
      toast.error("Veuillez remplir le nom, l'email et sélectionner un groupe.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Non authentifié. Veuillez vous connecter.");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `http://127.0.0.1:8000/api/groups/${selectedGroup.id}/invite`,
        { name: inviteName, email: inviteEmail },
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );
      toast.success("Invitation envoyée avec succès.");
      setInviteName('');
      setInviteEmail('');
    } catch (error) {
      console.error("Erreur lors de l'invitation:", error);
      toast.error("Erreur lors de l'envoi de l'invitation.");
    }
  };

  // Fonction pour afficher le contenu d'un fichier en fonction de son type
  const renderFileContent = (file) => {
    const fileExtension = file.filePath.split('.').pop().toLowerCase();

    if (['png', 'jpg', 'jpeg', 'gif'].includes(fileExtension)) {
      // Afficher une image
      return <img src={file.filePath} alt="Fichier Image" style={{ maxWidth: '200px' }} />;
    } else if (['txt'].includes(fileExtension)) {
      // Lire et afficher un fichier texte
      return <pre>{fetchTextFileContent(file.filePath)}</pre>;
    } else if (['pdf'].includes(fileExtension)) {
      // Lien pour télécharger ou visualiser le PDF
      return <a href={file.filePath} target="_blank" rel="noopener noreferrer">Ouvrir PDF</a>;
    } else {
      // Autres types de fichiers - lien de téléchargement
      return <a href={file.filePath} download>Télécharger {file.filePath}</a>;
    }
  };

  // Fonction pour récupérer le contenu d'un fichier texte
  const fetchTextFileContent = async (filePath) => {
    try {
      const response = await axios.get(filePath);
      return response.data; // Contenu du fichier texte
    } catch (error) {
      console.error("Erreur lors de la lecture du fichier texte:", error);
      return "Impossible de lire le fichier";
    }
  };

  // Fonction pour ajouter un groupe
  const addGroup = async () => {
    if (!newGroupName || !newGroupDescription) {
      toast.error("Veuillez remplir le nom et la description du groupe.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Non authentifié. Veuillez vous connecter.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/groups',
        { name: newGroupName, description: newGroupDescription },
        {
          headers: { "Authorization": `Bearer ${token}` }
        }
      );
      const newGroup = response.data.group;
      setGroups([...groups, newGroup]);
      setNewGroupName('');
      setNewGroupDescription('');
      setShowCreateGroupForm(false);
      toast.success("Groupe créé avec succès.");
    } catch (error) {
      console.error("Erreur lors de la création du groupe:", error);
      toast.error("Erreur lors de la création du groupe.");
    }
  };

  return (
    <div className="group-chat-container">
    {/* Left Panel - Group List */}
    <div className="group-list">
      <h2>Vos Groupes</h2>
      <ul>
        {groups.map((group, index) => (
          <li key={group && group.id ? group.id : index} onClick={() => handleGroupSelect(group)}>
            {group && group.name ? group.name : "Nom du groupe non disponible"}
          </li>
        ))}
      </ul>
  
      <button onClick={() => setShowCreateGroupForm(true)}>Créer un Groupe</button>
  
      {showCreateGroupForm && (
        <div>
          <h3>Nouveau Groupe</h3>
          <input
            type="text"
            placeholder="Nom du groupe"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description du groupe"
            value={newGroupDescription}
            onChange={(e) => setNewGroupDescription(e.target.value)}
          />
          <button onClick={addGroup}>Créer</button>
        </div>
      )}
    </div>
  
    {/* Right Panel - Selected Group Messages and Files */}
    <div className="chat-area">
      {selectedGroup ? (
        <div>
          <h3>Groupe: {selectedGroup.name}</h3>
          <h4>Messages</h4>
          <ul>
            {messages.map((message) => (
              <li key={message.id}>
                <span>{message.uploadedBy}: {message.text}</span>
              </li>
            ))}
          </ul>
  
          <h4>Fichiers</h4>
          <ul>
            {files.map((file) => (
              <li key={file.id}>
                <span>{file.uploadedBy}: {renderFileContent(file)}</span>
              </li>
            ))}
          </ul>
  
          <input
            type="text"
            placeholder="Tapez un message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <input type="file" onChange={handleFileChange} />
          <button onClick={sendMessage}>Envoyer</button>
  
          {/* Invite User */}
          <div className="invite-user">
            <h4>Inviter un utilisateur</h4>
            <input
              type="text"
              placeholder="Nom"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <button onClick={inviteUserToGroup}>Inviter</button>
          </div>
        </div>
      ) : (
        <p>Sélectionnez un groupe pour voir les messages</p>
      )}
    </div>
  </div>
  
  );
}

export default Group;
