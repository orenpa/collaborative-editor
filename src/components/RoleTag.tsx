import React from "react";

interface RoleTagProps {
  role: string;
}
function RoleTag(props: RoleTagProps) {
  const { role } = props;
  return <div className="role-tag">{role.toUpperCase()}</div>;
}

export default RoleTag;
