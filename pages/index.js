import React, { useState } from "react";

export default function Home() {
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.target);

    try {
      const response = await fetch("Ton lien WebHook", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        console.log("Réponse JSON :", result);
        setConfirmation(result.reply || "Merci pour votre message !");
      } else {
        const text = await response.text();
        console.log("Réponse texte brut :", text);
        setConfirmation(text || "Votre message a bien été envoyé !");
      }
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
      setConfirmation("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md transition transform hover:scale-105">
        {loading ? (
          <p className="text-blue-600 font-semibold text-center">Traitement en cours...</p>
        ) : confirmation ? (
          <p className="text-green-600 font-bold text-center">{confirmation}</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
              Contactez-nous
            </h1>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom :</label>
            <input
              type="text"
              name="name"
              className="border border-gray-300 rounded-lg w-full p-3 mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            />
            <label className="block text-sm font-medium text-gray-700 mb-2">Email :</label>
            <input
              type="email"
              name="email"
              className="border border-gray-300 rounded-lg w-full p-3 mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            />
            <label className="block text-sm font-medium text-gray-700 mb-2">Message :</label>
            <textarea
              name="message"
              className="border border-gray-300 rounded-lg w-full p-3 mb-6 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            ></textarea>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
            >
              Soumettre
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
