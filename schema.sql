-- Création de la table ROLE
CREATE TABLE ROLE (
    id_role INTEGER PRIMARY KEY AUTOINCREMENT,
    libelle VARCHAR(50) NOT NULL
);

-- Création de la table UTILISATEUR
CREATE TABLE UTILISATEUR (
    id_utilisateur INTEGER PRIMARY KEY AUTOINCREMENT,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_role INTEGER,
    FOREIGN KEY (id_role) REFERENCES ROLE(id_role)
);

-- Création de la table CONTENU
CREATE TABLE CONTENU (
    id_contenu INTEGER PRIMARY KEY AUTOINCREMENT,
    titre VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    contenu TEXT,
    date_publication DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table EXERCICE_RESPIRATION
CREATE TABLE EXERCICE_RESPIRATION (
    id_exercice INTEGER PRIMARY KEY AUTOINCREMENT,
    nom VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    duree INTEGER,
    temps_inspiration INTEGER,
    temps_expiration INTEGER
);

-- Création des tables d'association
CREATE TABLE LANCE (
    id_utilisateur INTEGER,
    id_exercice INTEGER,
    date_lancement DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_utilisateur, id_exercice, date_lancement),
    FOREIGN KEY (id_utilisateur) REFERENCES UTILISATEUR(id_utilisateur),
    FOREIGN KEY (id_exercice) REFERENCES EXERCICE_RESPIRATION(id_exercice)
);

CREATE TABLE CONSULTE (
    id_utilisateur INTEGER,
    id_contenu INTEGER,
    date_consultation DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_utilisateur, id_contenu, date_consultation),
    FOREIGN KEY (id_utilisateur) REFERENCES UTILISATEUR(id_utilisateur),
    FOREIGN KEY (id_contenu) REFERENCES CONTENU(id_contenu)
);