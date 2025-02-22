import React from "react";
import { Link } from "react-router-dom";

interface NewsletterCardProps {
  id: string;
  image: string;
  date: Date;
}

const NewsletterCard: React.FC<NewsletterCardProps> = ({ id, image, date }) => {
  const formattedDate = new Date(date).toLocaleDateString("pt-BR");

  const handleCardClick = async () => {
    const userString = localStorage.getItem("user");
    if (!userString) {
      console.error("No logged in user found in localStorage.");
    }
    if (userString) {
      const user = JSON.parse(userString);
      // Prepare the data to send to the backend
      const payload = {
        newsletterId: id,
        simulatedDate: localStorage.getItem("simulatedDate"),
      };
      try {
        // Make a POST request to update the user's history.
        // Adjust the URL and payload as needed to match your backend API.
        const response = await fetch(
          `http://localhost:3001/users/${user.id}/history`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to update history: ${response.status}`);
        }
        console.log("User history updated successfully.");
      } catch (error: any) {
        console.error("Error updating user history:", error.message);
      }

      // Check for streak increase
      //
    }

    return;
  };

  return (
    <Link to={`/newsletter/${id}`} onClick={handleCardClick}>
      <div className="bg-tn-yellow max-w-96 overflow-hidden rounded-lg border border-gray-200 p-0 cursor-pointer hover:shadow-md hover:-translate-x-1 hover:-translate-y-1 transition-all ease-in-out">
        <img
          src={image}
          alt="Newsletter"
          className="w-full h-48 object-cover"
        />
        <p className="my-4 mx-4 text-neutral-800 text-xl font-semibold">
          {formattedDate}
        </p>
      </div>
    </Link>
  );
};

export default NewsletterCard;
