import classNames from "classnames";
import React, { useState } from "react";
import { motion } from "framer-motion";

interface ActivityHeaderProps {
  title: string;
  description: string;
}

const tabbedUsers = ["Thomas", "John", "Jane"];

export default function ActivityHeader(props: ActivityHeaderProps) {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  return (
    <div className={"bg-white w-full px-12 border-b border-b-gray-200"}>
      <h1 className={"text-gray-800 text-3xl font-medium mt-8"}>
        {props.title}
      </h1>
      <h4 className={"text-gray-400 text-lg mt-2 mb-8"}>{props.description}</h4>
      <div className={"flex gap-3"}>
        {tabbedUsers.map((user, index) => (
          <div
            key={index}
            onClick={() => setSelectedTab(index)}
            className={"cursor-pointer"}
          >
            <div
              className={classNames({
                "text-primary-500": selectedTab === index,
                "border-b-2 border-b-none text-gray-400": selectedTab !== index,
              })}
            >
              {user}
            </div>
            {selectedTab === index && (
              <motion.div
                layoutId="tab-underline"
                className={"border-b-2 border-b-primary-500"}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
