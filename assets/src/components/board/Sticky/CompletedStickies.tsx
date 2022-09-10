import classNames from "classnames";
import Masonry from "react-masonry-component";
import CompletedSticky from "src/components/board/Sticky/CompletedSticky";

interface CompletedStickiesProps {
  stickyIds: string[];
  stickiesById: Record<string, Sticky>;
  showOptions?: boolean;
  reverseStickyOrder?: boolean;
  className?: string;
}

export default function CompletedStickies(props: CompletedStickiesProps) {
  const { stickyIds, stickiesById } = props;

  // TODO: should just iterate backwards or something else more efficient
  const stickyIdsWithOrdering = props.reverseStickyOrder
    ? [...stickyIds].reverse()
    : stickyIds;

  return (
    <Masonry
      className={classNames({
        "flex-1 overflow-x-hidden flex flex-col flex-wrap gap-5 min-h-[18rem]":
          true,
        [props.className || ""]: props.className,
      })}
      options={{ transitionDuration: 0 }}
    >
      {stickyIdsWithOrdering
        .filter((stickyId) => stickyId in stickiesById)
        .map((stickyId) => (
          <CompletedSticky
            key={stickyId}
            stickyId={stickyId}
            title={stickiesById[stickyId].title}
            description={stickiesById[stickyId].description}
            showOptions={props.showOptions}
            className="mr-3 mb-3"
          />
        ))}
    </Masonry>
  );
}
