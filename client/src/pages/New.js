import React from "react";
import { Button, notification, Tabs } from "antd";

const New = () => {
  return (
    <div style={{ marginTop: 40 }}>
      <Tabs
        defaultActiveKey="1"
        centered
        items={Array.from({ length: 3 }).map((_, i) => {
          const id = String(i + 1);
          return {
            label: `Tab ${id}`,
            key: id,
            children: `Content of Tab Pane ${id}`,
          };
        })}
      />
    </div>
  );
};

export default New;
