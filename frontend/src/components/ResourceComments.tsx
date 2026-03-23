import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: number;
  user_name: string;
  content: string;
  created_at: string;
}

export const ResourceComments = () => {

  const { id } = useParams();

  const [comments,
    setComments] = useState<Comment[]>([]);

  const [text,
    setText] = useState("");



  // Fetch resource comments
  useEffect(() => {

    fetch(
      `http://localhost:5000/api/comments/resource/${id}`
    )
      .then(res => res.json())
      .then(data => setComments(data));

  }, [id]);



  // Post comment
  const handlePost = async () => {

    const userId =
      localStorage.getItem("userId");

    await fetch(
      "http://localhost:5000/api/comments",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          user_id: Number(userId),
          resource_id: Number(id),
          text
        })
      }
    );

    setText("");

    // refresh
    fetch(
      `http://localhost:5000/api/comments/resource/${id}`
    )
      .then(res => res.json())
      .then(data => setComments(data));

  };



  return (

    <div className="p-6">

      <h2 className="text-2xl font-bold mb-4">
        Resource Comments
      </h2>


      <textarea
        value={text}
        onChange={(e) =>
          setText(e.target.value)
        }
        className="w-full border p-3 mb-3"
        placeholder="Write update..."
      />


      <button
        onClick={handlePost}
        className="bg-blue-600 text-white px-4 py-2"
      >
        Post Comment
      </button>



      <div className="mt-6 space-y-4">

        {comments.map(c => (

          <div
            key={c.id}
            className="border p-3 rounded"
          >

            <div className="font-semibold">
              {c.user_name}
            </div>

            <p>{c.content}</p>

            <div className="text-xs text-gray-500">

              {formatDistanceToNow(
                new Date(c.created_at)
              )} ago

            </div>

          </div>

        ))}

      </div>

    </div>

  );

};