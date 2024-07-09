
import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function TitleDescrip() {
  const [Disc, setDisc] = useState(" ");
  const activeIssue = useSelector((state) => state.activeIssue.value);
  const [title, setTitle] = useState("");
  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const response = await axios.get(
          `${process.env. REACT_APP_BACKEND_BASE_URL}/api/workspace/issue/description`,
          {
            params: {
              activeIssueId: activeIssue._id,
            },
            withCredentials: true,
          }
        );


        const assigneeUsername = response.data;
        console.log(assigneeUsername);
        const title = assigneeUsername.issue.title;
        const Disc = assigneeUsername.issue.description;
        setTitle(title);
        setDisc(Disc);
      } catch (error) {
        console.error("Failed to fetch issue:", error);
      }
    };

    fetchIssue();
  }, []);

  const updateIssueDetails = async (update) => {
    try {
      // Make a PUT request to the update issue details API
      console.log("activnesss", activeIssue._id);
      const response = await axios.put(
        `${process.env. REACT_APP_BACKEND_BASE_URL}/api/workspace/issue/updateDescription`,
        {
          issueId: activeIssue._id, // replace with actual issue ID
          update,
        },
        {
          withCredentials: true,
        }
      );

      // Handle the response as needed
      console.log(response.data);
    } catch (error) {
      console.error("Failed to update issue details:", error);
    }
  };

  const fnc1 = async (event) => {
    const newTitle = event.target.textContent;
    await updateIssueDetails({ title: newTitle });
  };
  
  const fnc2 = async (event) => {
    const newDescription = event.target.textContent;
    await updateIssueDetails({ description: newDescription });
  };
  
  return (
    <div className="h-auto p-3 m-3 mb-0 ">
      <h1
        className="text-3xl tracking-wide mb-[3vh] font-semibold"
        contentEditable="true"
       
        onBlur = {fnc1}
      >
        {title}
      </h1>
      <p
        className=" tracking-wide text-wrap  font-semibold min-h-[10vh] border-0"
        contentEditable="true"
        
        onBlur = {fnc2}
      >
        {Disc}
      </p>
    </div>
  );
}

export default TitleDescrip;
