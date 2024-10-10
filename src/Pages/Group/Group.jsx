
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './Group.css';
// import { toast } from "react-toastify";

// function Group() {
//   const [showInviteFields, setShowInviteFields] = useState(false);
//   const [groups, setGroups] = useState([]);
//   const [newGroupName, setNewGroupName] = useState('');
//   const [newGroupDescription, setNewGroupDescription] = useState('');
//   const [selectedGroup, setSelectedGroup] = useState();
//   const [messages, setMessages] = useState([]);
//   const [files, setFiles] = useState([]); // État pour les fichiers
//   const [newMessage, setNewMessage] = useState('');
//   const [showCreateGroupForm, setShowCreateGroupForm] = useState(false);
//   const [file, setFile] = useState(null);
//   const [inviteName, setInviteName] = useState('');
//   const [inviteEmail, setInviteEmail] = useState('');
//   const navigate = useNavigate();

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

//   const handleGroupSelect = async (group) => {
//     setSelectedGroup(group);

//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("Non authentifié. Veuillez vous connecter.");
//       navigate("/login");
//       return;
//     }

//     try {
//       // Récupération des messages et fichiers du groupe
//       const response = await axios.get(`http://127.0.0.1:8000/api/getGroups`, {
//         headers: { "Authorization": `Bearer ${token}` }
//       });

//       const groupData = response.data.find(g => g.id === group.id);

//       if (groupData) {
//         const { messages = [], fichiers = [] } = groupData;

//         const formattedMessages = messages.map(message => ({
//           id: message.id,
//           text: message.text,
//           uploadedBy: message.name
//         }));

//         const formattedFiles = fichiers.map(fichier => ({
//           id: fichier.id,
//           filePath: fichier.file_path,
//           uploadedBy: fichier.uploaded_by || ''
//         }));

//         setMessages(formattedMessages);
//         setFiles(formattedFiles);
//       } else {
//         setMessages([]);
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
//     const userName = localStorage.getItem("userName");

//     const messageToSend = {
//       id: messages.length + 1,
//       text: newMessage,
//       file: uploadedFileUrl,
//       uploadedBy: userName
//     };

//     setMessages([...messages, messageToSend]);  // Mettre à jour localement avant la requête réseau
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
//     formData.append('file_name', file);
//     formData.append('groupe_id', selectedGroup.id);

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
//       const { file_name, uploaded_by } = response.data.fichier;
//       return { file_name, uploaded_by };
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

// // Fonction pour afficher le contenu d'un fichier en fonction de son type
// const renderFileContent = (file) => {
//   const fileExtension = file.filePath.split('.').pop().toLowerCase();

//   if (['png', 'jpg', 'jpeg', 'gif'].includes(fileExtension)) {
//     // Afficher une image
//     return <img src={"http://127.0.0.1:8000/storage/" + file.filePath} alt="Fichier Image" style={{ maxWidth: '200px' }} />;
//   } else if (['txt'].includes(fileExtension)) {
//     // Lire et afficher un fichier texte
//     return <pre>{fetchTextFileContent("http://127.0.0.1:8000/storage/" + file.filePath)}</pre>;
//   } else if (['pdf'].includes(fileExtension)) {
//     // Lien pour télécharger ou visualiser le PDF
//     return <a href={"http://127.0.0.1:8000/storage/" + file.filePath} target="_blank" rel="noopener noreferrer">Ouvrir PDF</a>;
//   } else {
//     // Autres types de fichiers - lien de téléchargement
//     return <a href={"http://127.0.0.1:8000/storage/" + file.filePath} download>Télécharger {file.filePath}</a>;
//   }
// };

//   const fetchTextFileContent = async (filePath) => {
//     try {
//       const response = await axios.get(filePath);
//       return response.data;
//     } catch (error) {
//       console.error("Erreur lors de la lecture du fichier texte:", error);
//       return "Impossible de lire le fichier";
//     }
//   };

//   const addGroup = async () => {
//     if (!newGroupName || !newGroupDescription) {
//       toast.error("Veuillez remplir le nom et la description du groupe.");
//       return;
//     }

//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("Non authentifié. Veuillez vous connecter.");
//       navigate("/login");
//       return;
//     }

//     // Créer le groupe localement avant l'appel réseau
//     const newGroup = {
//       id: groups.length + 1, // Ou utilisez un UUID si disponible
//       name: newGroupName,
//       description: newGroupDescription
//     };

//     setGroups([...groups, newGroup]); // Mettre à jour localement
//     setNewGroupName('');
//     setNewGroupDescription('');
//     setShowCreateGroupForm(false);
//     toast.success("Groupe créé localement, en attente du serveur...");

//     try {
//       const response = await axios.post(
//         'http://127.0.0.1:8000/api/groups',
//         { name: newGroupName, description: newGroupDescription },
//         {
//           headers: { "Authorization": `Bearer ${token}` }
//         }
//       );
//       toast.success("Groupe créé avec succès.");
//     } catch (error) {
//       console.error("Erreur lors de la création du groupe:", error);
//       toast.error("Erreur lors de la création du groupe.");
//     }
//   };

//   return (
//     <div className="group-chat-container">
//       {/* Left Panel - Group List */}
//       <div className="group-list">
//         <h2>Vos Groupes</h2>

//         <button onClick={() => setShowCreateGroupForm(true)}>Créer un Groupe</button>
//         <ul>
//           {groups.map((group, index) => (
//             <li key={group && group.id ? group.id : index} onClick={() => handleGroupSelect(group)}>
//               {group && group.name ? group.name : "Nom du groupe non disponible"}
//             </li>
//           ))}
//         </ul>

//         {showCreateGroupForm && (
//           <div>
//             <h3>Nouveau Groupe</h3>
//             <input
//               type="text"
//               placeholder="Nom du groupe"
//               value={newGroupName}
//               onChange={(e) => setNewGroupName(e.target.value)}
//             />
//             <textarea
//               placeholder="Description du groupe"
//               value={newGroupDescription}
//               onChange={(e) => setNewGroupDescription(e.target.value)}
//             />
//             <button onClick={addGroup}>Créer</button>
//             <button onClick={() => setShowCreateGroupForm(false)}>Annuler</button>
//           </div>
//         )}
//       </div>

//       {/* Right Panel - Messages and Files */}
//       <div className="message-panel">
//         {selectedGroup ? (
//           <>
//             <h2>{selectedGroup.name}</h2>

//             <div className="messages">
//               {messages.map((message) => (
//                 <div key={message.id}>
//                   <strong>{message.uploadedBy}: </strong> {message.text}
//                 </div>
//               ))}

//               {files.map((file) => (
//                 <div key={file.id}>
//                   <strong>{file.uploadedBy}  </strong>
//                   {renderFileContent(file)}
//                 </div>
//               ))}
//             </div>

//             <div className="message-input">
            
//               <input type="file" onChange={handleFileChange} />
//               <button onClick={sendMessage}>Envoyer</button>
//             </div>

//             <div>
//           <button onClick={() => setShowInviteFields(!showInviteFields)}>
//             Inviter un utilisateur
//           </button>
//           {showInviteFields && (
//             <div>
//               <input type="text" value={inviteName} placeholder="Nom" onChange={(e) => setInviteName(e.target.value)} />
//               <input type="email" value={inviteEmail} placeholder="Email" onChange={(e) => setInviteEmail(e.target.value)} />
//               <button onClick={inviteUserToGroup}>Envoyer l'invitation</button>
//             </div>
//           )}
//         </div>
     
//           </>
//         ) : (
//           <p>Sélectionnez un groupe pour voir les messages et les fichiers.</p>
//         )}
//       </div>
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
  const [showInviteFields, setShowInviteFields] = useState(false);
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [selectedGroup, setSelectedGroup] = useState();
  const [messages, setMessages] = useState([]);
  const [files, setFiles] = useState([]); // État pour les fichiers
  const [newMessage, setNewMessage] = useState('');
  const [showCreateGroupForm, setShowCreateGroupForm] = useState(false);
  const [file, setFile] = useState(null);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("Déconnecté avec succès.");
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
          uploadedBy: fichier.uploaded_by || ''
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

 
  // const sendMessage = async () => {
  //   if (newMessage.trim() === '' && !file) return; // Ne pas envoyer si aucun message ou fichier n'est présent
  
  //   try {
  //     const uploadedFileUrl = file ? await uploadFile(file) : null; // Attendre que le fichier soit uploadé avant de continuer
  //     const userName = localStorage.getItem("userName");
      
  //     const messageToSend = {
  //       id: messages.length + 1, // ID temporaire, l'ID réel sera géré par le serveur
  //       text: newMessage,
  //       file: uploadedFileUrl,
  //       uploadedBy: userName
  //     };
  
  //     if (uploadedFileUrl || newMessage) {
  //       setMessages([...messages, messageToSend]);  // Mettre à jour seulement si l'upload a réussi
  //       setNewMessage('');  // Réinitialiser le message
  //       setFile(null);  // Réinitialiser le fichier
  //     }
  //   } catch (error) {
  //     console.error("Erreur lors de l'envoi du message ou du fichier:", error);
  //     toast.error("Erreur lors de l'envoi du fichier. Veuillez réessayer.");
  //   }
  // };
  // const handleFileChange = (e) => {
  //   setFile(e.target.files[0]);
  // };

  // const uploadFile = async (file) => {
  //   const token = localStorage.getItem("token");
  //   if (!file || !selectedGroup || !token) return null;
  
  //   const formData = new FormData();
  //   formData.append('file_name', file);
  //   formData.append('groupe_id', selectedGroup.id);
  
  //   try {
  //     const response = await axios.post(
  //       `http://127.0.0.1:8000/api/groups/${selectedGroup.id}/files`,
  //       formData,
  //       {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //           "Authorization": `Bearer ${token}`
  //         }
  //       }
  //     );
  //     // Extraction des détails du fichier après upload réussi
  //     const { file_name, uploaded_by } = response.data.fichier;
  //     return { file_name, uploaded_by };
  //   } catch (error) {
  //     console.error("Erreur lors de l'upload du fichier:", error);
  //     return null;
  //   }
  // };
  
  const sendMessage = async () => {
    if (newMessage.trim() === '' && !file) return;
  
    const userName = localStorage.getItem("userName");
    const uploadedFileUrl = file ? await uploadFile(file) : null;
  
    const messageToSend = {
      text: newMessage,
      file: uploadedFileUrl,
      uploadedBy: userName
    };
  
    try {
      // Envoi du message au serveur
      const response = await axios.post(
        `http://127.0.0.1:8000/api/groups/${selectedGroup.id}/messages`,
        messageToSend,
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
  
      // Ajout du message retourné par l'API directement à notre état local
      const newMessageResponse = {
        id: response.data.id, // Supposons que l'API retourne un ID
        text: response.data.text,
        uploadedBy: response.data.uploadedBy,
        file: response.data.file // Si l'API retourne les détails du fichier
      };
  
      setMessages(prevMessages => [...prevMessages, newMessageResponse]); // Met à jour l'état local
  
      // Réinitialiser les champs
      setNewMessage('');
      setFile(null);
  
      // Optionnel: Afficher un message de succès
      toast.success("Message envoyé avec succès.");
      
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      toast.error("Erreur lors de l'envoi du message.");
    }
  };
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const uploadFile = async (file) => {
    const token = localStorage.getItem("token");
    if (!file || !selectedGroup || !token) return null;
  
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
  
      // Retourner les informations du fichier
      return response.data.fichier; // Assure-toi que l'API retourne ces données
    } catch (error) {
      console.error("Erreur lors de l'upload du fichier:", error);
      return null;
    }
  };
  
  
  const inviteUserToGroup = async () => {
    const token = localStorage.getItem("token");

    if (!inviteName || !inviteEmail || !selectedGroup || !token) {
      alert("Veuillez entrer un nom, un email et sélectionner un groupe.");
      return;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/groups/${selectedGroup.id}/members`,  // URL d'invitation avec groupId
        {
          name: inviteName,
          email: inviteEmail,
          groupe_id: selectedGroup.id
        },
        {
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
          }
        }
      );

      alert(`Invitation envoyée à ${inviteEmail}`);
      setInviteName('');
      setInviteEmail('');
    } catch (error) {
      if (error.response && error.response.status === 422) {
        alert("Cet email a déjà été invité.");
      } else {
        console.error("Erreur lors de l'invitation de l'utilisateur:", error);
        alert("Erreur lors de l'envoi de l'invitation.");
      }
    }
  };

// Fonction pour afficher le contenu d'un fichier en fonction de son type
// Fonction pour afficher le contenu d'un fichier en fonction de son type
// Fonction pour afficher le contenu d'un fichier en fonction de son type
const renderFileContent = (file) => {
  const fileExtension = file.filePath.split('.').pop().toLowerCase();
  
  const fileUrl = `http://127.0.0.1:8000/storage/${file.filePath}`;
  
  if (['png', 'jpg', 'jpeg', 'gif'].includes(fileExtension)) {
    // Afficher une image avec un lien pour ouvrir et un bouton de téléchargement
    return (
      <div className="file-box">
        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
          <img src={fileUrl} alt="Fichier Image" style={{ maxWidth: '200px', display: 'block' }} />
        </a>
        <a href={fileUrl} download>Télécharger {file.filePath}</a>
      </div>
    );
  } else if (['txt'].includes(fileExtension)) {
    // Lire et afficher un fichier texte
    return (
      <div className="file-box">
        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
          <pre>{fetchTextFileContent(fileUrl)}</pre>
        </a>
        <a href={fileUrl} download>Télécharger {file.filePath}</a>
      </div>
    );
  } else if (['pdf'].includes(fileExtension)) {
    // Lien pour ouvrir le PDF dans un nouvel onglet et un bouton de téléchargement
    return (
      <div className="file-box">
        <a href={fileUrl} target="_blank" rel="noopener noreferrer">Ouvrir PDF</a>
        <a href={fileUrl} download>Télécharger PDF</a>
      </div>
    );
  } else {
    // Autres types de fichiers - lien pour ouvrir et télécharger
    return (
      <div className="file-box">
        <a href={fileUrl} target="_blank" rel="noopener noreferrer">Ouvrir {file.filePath}</a>
        <a href={fileUrl} download>Télécharger {file.filePath}</a>
      </div>
    );
  }
};

  const fetchTextFileContent = async (filePath) => {
    try {
      const response = await axios.get(filePath);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la lecture du fichier texte:", error);
      return "Impossible de lire le fichier";
    }
  };

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

    // Créer le groupe localement avant l'appel réseau
    const newGroup = {
      id: groups.length + 1, // Ou utilisez un UUID si disponible
      name: newGroupName,
      description: newGroupDescription
    };

    setGroups([...groups, newGroup]); // Mettre à jour localement
    setNewGroupName('');
    setNewGroupDescription('');
    setShowCreateGroupForm(false);
    toast.success("Groupe créé localement, en attente du serveur...");

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/groups',
        { name: newGroupName, description: newGroupDescription },
        {
          headers: { "Authorization": `Bearer ${token}` }
        }
      );
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
        <button onClick={handleLogout} style={{ marginBottom: '10px' }}>Déconnexion</button>
        <button onClick={() => setShowCreateGroupForm(true)}>Créer un Groupe</button>
        <ul>
          {groups.map((group, index) => (
            <li key={group && group.id ? group.id : index} onClick={() => handleGroupSelect(group)}>
              {group && group.name ? group.name : "Nom du groupe non disponible"}
            </li>
          ))}
        </ul>

        {showCreateGroupForm && (
          <div>
            <h3>Nouveau Groupe</h3>
            <input
              type="text"
              placeholder="Nom du groupe"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <textarea
              placeholder="Description du groupe"
              value={newGroupDescription}
              onChange={(e) => setNewGroupDescription(e.target.value)}
            />
            <button onClick={addGroup}>Créer</button>
            <button onClick={() => setShowCreateGroupForm(false)}>Annuler</button>
          </div>
        )}
      </div>

      {/* Right Panel - Messages and Files */}
      <div className="message-panel">
        {selectedGroup ? (
          <>
            <h2>{selectedGroup.name}</h2>

            <div className="messages">
              {messages.map((message) => (
                <div key={message.id}>
                  <strong>{message.uploadedBy}: </strong> {message.text}
                </div>
              ))}

              {files.map((file) => (
                <div key={file.id}>
                  <strong>{file.uploadedBy}  </strong>
                  {renderFileContent(file)}
                </div>
              ))}
            </div>

            <div className="message-input">
            
              <input type="file" onChange={handleFileChange} />
              <button onClick={sendMessage}>Envoyer</button>
            </div>

            <div>
          <button onClick={() => setShowInviteFields(!showInviteFields)}>
            Inviter un utilisateur
          </button>
          {showInviteFields && (
            <div>
              <input type="text" value={inviteName} placeholder="Nom" onChange={(e) => setInviteName(e.target.value)} />
              <input type="email" value={inviteEmail} placeholder="Email" onChange={(e) => setInviteEmail(e.target.value)} />
              <button onClick={inviteUserToGroup}>Envoyer l'invitation</button>
            </div>
          )}
        </div>
     
          </>
        ) : (
          <p>Sélectionnez un groupe pour voir les messages et les fichiers.</p>
        )}
      </div>
    </div>
  );
}


export default Group;


