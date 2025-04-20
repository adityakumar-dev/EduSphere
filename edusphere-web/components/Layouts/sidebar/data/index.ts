import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Assignments",
        icon: Icons.HomeIcon,
        url : '/dashboard/assignment',
        items: [
          // {
          //   title: "Check all Assignments",
          //   url: "/",
          // },
        ],
      },
      {
        title: "Attendance",
        url: "/attendance",
        icon: Icons.Calendar,
        items: [],
      },
      {
        title: "Time Table",
        url: "/dashboard/time-table",
        icon: Icons.User,
        items: [],
      },
      {
        title: "Results",
        icon: Icons.Alphabet,
        items: [
          // {
          //   title: "Check all Results",
          //   url: "/forms/form-elements",
          // },
          // {
          //   title: "Form Layout",
          //   url: "/forms/form-layout",
          // },
        ],
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Icons.Table,
        items: [
          // {
          //   title: "Tables",
          //   url: "/tables",
          // },
        ],
      },
      // {
      //   title: "Pages",
      //   icon: Icons.Alphabet,
      //   items: [
      //     {
      //       title: "Settings",
      //       url: "/pages/settings",
      //     },
      //   ],
      // },
    ],
  },
 
];
