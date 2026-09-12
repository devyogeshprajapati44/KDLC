import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import "./chart.css";


function Chart({ counts }) {


  const pieData = [
    {
      name: "Users",
      value: counts?.totalUsers || 0,
    },
    {
      name: "Products",
      value: counts?.totalProducts || 0,
    },
    {
      name: "Orders",
      value: counts?.totalOrders || 0,
    },
  ];


  const barData = [
    {
      name:"Users",
      value:counts?.totalUsers || 0
    },

    {
      name:"Products",
      value:counts?.totalProducts || 0
    },

    {
      name:"Orders",
      value:counts?.totalOrders || 0
    }
  ];


  const COLORS = [
    "#2563eb",
    "#7c3aed",
    "#f59e0b"
  ];



  return (

    <div className="chart-wrapper">


      {/* Pie Chart */}

      <div className="chart-card">

        <h4>
          Current Visits
        </h4>


        <div className="pie-area">

          <ResponsiveContainer width="100%" height={280}>

            <PieChart>

              <Pie

                data={pieData}

                cx="50%"

                cy="50%"

                innerRadius={60}

                outerRadius={100}

                paddingAngle={5}

                dataKey="value"

              >

                {
                  pieData.map((entry,index)=>(
                    <Cell
                      key={index}
                      fill={COLORS[index]}
                    />
                  ))
                }


              </Pie>


              <Tooltip />


            </PieChart>


          </ResponsiveContainer>


        </div>


        <div className="chart-legends">

          {
            pieData.map((item,index)=>(

              <div 
                className="legend"
                key={item.name}
              >

                <span
                  style={{
                    background:COLORS[index]
                  }}
                ></span>

                {item.name}

              </div>

            ))
          }

        </div>


      </div>





      {/* Bar Chart */}


      <div className="chart-card">


        <h4>
          Website Visits
        </h4>


        <ResponsiveContainer width="100%" height={300}>


          <BarChart data={barData}>


            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />


            <XAxis
              dataKey="name"
            />


            <YAxis />


            <Tooltip />


            <Bar

              dataKey="value"

              fill="#4f46e5"

              radius={[
                10,
                10,
                0,
                0
              ]}

            />


          </BarChart>


        </ResponsiveContainer>


      </div>



    </div>

  );
}


export default Chart;