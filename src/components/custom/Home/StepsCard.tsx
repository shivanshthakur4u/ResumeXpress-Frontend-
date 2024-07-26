import React from "react";

function StepsCard() {
  const CardData = [
    {
      id: 1,
      title: " Choose Template Theme color",
      desc: "You've got plenty of Theme color more Template and Template Coming Soon..",
    },
    {
      id: 2,
      title: "Enter the Details For Resume",
      desc: "Enter the Details you want to show on your resume",
    },
    {
      id: 3,
      title: "Share as PDF or Web",
      desc: "Download your resume or share you live resume link",
    },
  ];
  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 mx-20 gap-5 max-sm:mx-6">
      {CardData?.map((e, i) => (
        <div
          className="flex-1 hover:bg-primary bg-gray-100 p-10 rounded-3xl items-start group"
          key={e.id}
        >
          <div className="p-10 items-center justify-center group-hover:bg-gray-50 bg-black w-[120px] rounded-3xl">
            <span className="group-hover:text-primary text-white font-bold text-5xl">
              {e.id}.
            </span>
          </div>
          {/* line progress */}
          <div className="w-full group-hover:bg-gray-300 group-hover:block hidden h-1.5 mt-16 rounded-lg">
            <div
              className="h-1.5 rounded-lg duration-500 ease-in-out transition-all"
              style={{
                width: (100 / CardData?.length) * e.id + "%",
                backgroundColor: "#fff",
              }}
            />
          </div>

          {/* Title / para */}
          <div className="flex flex-col gap-6 group-hover:mt-16 mt-36">
            <h2 className="text-4xl font-semibold group-hover:text-white text-black">
              {e.title}
            </h2>
            <p className="text-lg font-medium group-hover:text-gray-300 text-gray-400">
              {e.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StepsCard;
