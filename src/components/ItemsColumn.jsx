/* eslint-disable react/prop-types */
import Card from "./Card";


const ItemsColumn = ({ columnTitle, items }) => {
  return (
    <div
      className="lg:min-h-[60vh] min-h-full scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-300 overflow-y-auto p-4 rounded-md border border-blue-300"
    >
      <p className="uppercase text-sm mb-4 font-semibold">
        {columnTitle}
      </p>
      {items?.length === 0 && (
        <div className="flex justify-center items-center lg:h-[15rem] h-[8rem] w-full">
          <h4>No {columnTitle} item</h4>
        </div>
      )}
      <div className="">
        {items &&
          items.length > 0 &&
          items.map((item, index) => (
            <Card
              key={item.id}
              checked={item.checked}
              draggableId={item.id.toString()}
              index={index}
              id={item.id}
              title={item.title}
            />
          ))}
      </div>
    </div>
  );
};

export default ItemsColumn;
