import classNames from "classnames";
import React, { useState } from "react";
import { motion } from "framer-motion";

interface ActivityHeaderProps {
  title: string;
  description: string;
  tabbedOptions?: {
    key: number;
    value: string;
  }[];
  selectedTabbedOption?: number;
  onSelectTabbedOption?: (key: number) => void;
}

// const tabbedUsers = ["Thomas", "John", "Jane"];

export default function ActivityHeader(props: ActivityHeaderProps) {
  // const [selectedTab, setSelectedTab] = useState<number>(0);
  return (
    <div className={"bg-white w-full px-12 border-b border-b-gray-200 pt-8"}>
      <h1 className={"block text-gray-800 text-3xl font-medium"}>
        {props.title}
      </h1>
      <h4 className={"text-gray-400 text-lg mt-2 mb-8"}>{props.description}</h4>
      {props.tabbedOptions &&
        props.onSelectTabbedOption != null &&
        props.selectedTabbedOption != null && (
          <div className={"flex gap-3"}>
            {props.tabbedOptions.map((option, index) => (
              <div
                key={option.key}
                className={"cursor-pointer"}
                onClick={() => props.onSelectTabbedOption(option.key)}
              >
                <div
                  className={classNames({
                    "text-primary-500":
                      props.selectedTabbedOption === option.key,
                    "border-b-2 border-b-none text-gray-400":
                      props.selectedTabbedOption !== option.key,
                  })}
                >
                  {option.value}
                </div>
                {props.selectedTabbedOption === option.key && (
                  <motion.div
                    layoutId="tab-underline"
                    className={"border-b-2 border-b-primary-500"}
                  />
                )}
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
