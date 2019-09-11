import React from "react";

const ModuleRelevanceInfoPopupContent = () => {
  return (
    <div style={{ padding: "5px", marginTop: "15px" }}>
      <div style={{ color: "#000000" }}>{"Required Modules"}</div>
      <div style={{ color: "#999" }}>
        {
          "All Modules marked Required will have the label ‘REQ’ on the Module thumbnail for the Learners. The Learners can choose to complete such Modules on priority."
        }
      </div>
      <div style={{ color: "#000000", marginTop: "15px" }}>{"Optional Modules"}</div>
      <div style={{ color: "#999" }}>
        {
          "All Modules marked Optional will have the label ‘OPT’. The Learners can decide if they want to complete these or no."
        }
      </div>
      <div style={{ color: "#000000", marginTop: "15px" }}>{"Unmarked Modules"}</div>
      <div style={{ color: "#999" }}>
        {
          "All unmarked Modules will have no labels on the Module Thumbnail. The Learners will complete these Modules as a part of their regular learning."
        }
      </div>
      <div style={{ marginTop: "20px" }}>
        {
          "NOTE: You can go to the Module Invite and Track page later to change the Module Relevance for the invited Learners."
        }
      </div>
    </div>
  );
};

export default ModuleRelevanceInfoPopupContent;
