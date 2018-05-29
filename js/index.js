var width = 500,
    height = 250,
    margin = {left: 50, top: 30, right: 20, bottom: 20},
    g_width = width - margin.left - margin.right,
    g_height = height - margin.top - margin.bottom;

//select return first one
//selectAll return an array

//Three Little Circle -- describe d3
//How selections work -- describe select()

//svg
d3.select('#container')
    .append("svg:svg")
    //width,height
    .attr("width", width)  //attribute
    .attr("height", height);

var g = d3.select("svg")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); //translate from 0,0


var data = [1, 3, 5, 7, 9, 11, 15, 46];
//缩放函数
var scale_x = d3.scaleLinear()    //v3 -- scale.linear()
    .domain([0, data.length - 1])   //input range
    .range([0, g_width]);           //output range

var scale_y = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([g_height, 0]);  //数学上的y轴

var line_generator = d3.line() //v3 -- svg.line
    .x(function (d, i) {
        return scale_x(i);
    })    //0,1,2,3
    .y(function (d) {
        return scale_y(d);
    })   //1,3,5
    .curve(d3.curveCardinal);   // v3 -- interpolate("cardinal") 曲线化

g
    .append("path")
    .attr("d", line_generator(data));  //M -- start, L -- line , X,Y

var x_axis = d3.axisBottom(scale_x),  //v3 -- d3.svg.axis().scale(scale_x),
    y_axis = d3.axisLeft(scale_y);

g.append("g")
    .call(x_axis)
    .attr("transform", "translate(0," + g_height + ")");


g.append("g")
    .call(y_axis)
    .append("svg:text")
    .text("Price($)")
    .attr("font-size", "20px")
    .attr("transform", "rotate(-90)")    //旋转
    .attr("text-anchor", "end")  //对齐
    .attr("dy", "1em") //沿x轴偏移
    .attr("fill", "black");  //i don't know why we need this attr but it works ,otherwise we can not see the text because it is none color.


//polygon
d3.select('#container')
    .append("svg:svg")
    //width,height
    .attr("width", width)  //attribute
    .attr("height", height)
    .attr("id", "area_svg");

var area_generator = d3.area()
    .x(function (d, i) {
        return scale_x(i);
    })    //0,1,2,3
    .y0(g_height)       //line : axis_x
    .y1(function (d) {
        return scale_y(d);
    })   //1,3,5
    .curve(d3.curveCardinal);   // v3 -- interpolate("cardinal") 曲线化

//not a good solution: select svg by id
//still not find a good solution yet :(
//a good solution maybe select like jquery : select().next() etc.
g = d3.select("#area_svg")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); //translate from 0,0

g.append("path")
    .attr("d", area_generator(data))
    .style("fill", "steelblue"); //fill color


var bar_height = 50;
var bar_padding = 10;

//d3 csv(url,processor,callback)

// function type(d) {
//     d.population = +d.population; //str to int by '+'
//     return d;
// }

//可能会有跨域请求
//反正要配置很多东西，如果你是静态web
// d3.csv("data.csv", type, function (data) {
//      this.data = data;
// });

var svg_width = 500;
var svg_height = (bar_height + bar_padding) * data.length;
//square
var svg = d3.select('#container')
    .append("svg:svg")
    //width,height
    .attr("width", svg_width)  //attribute
    .attr("height", svg_height)
    .attr("id", "square_svg");

//Thinking with joins -- data binding
var bar = svg.selectAll("g")  //none <g>
    .data(data)     //bind data
    .enter()        //
    .append("g")        //total <g> = data.length
    .attr("transform", function (d, i) {
        return "translate(0," + i * (bar_padding + bar_height) + ")";
    });

/*
max(data,function (d) {
        return d.population;
    }
 */
var scale = d3.scaleLinear()        //must define before used
    .domain([0, d3.max(data)])
    .range([0, svg_width]);

bar.append("rect")
    .attr(
        "width", function (d) {
            return scale(d);
        }
    )
    .attr("height", bar_height)
    //i don't why but it is work if you split these two attr in d3.v5
    //it is nothing reference with script d3-select-multi
    //maybe attr() is not support a js object
    //but in mooc tutorial it really works when you put a object in attr()
    /*
    .attr({
        "width": function (d) {
            return d;
        },
        "height": bar_height
    })
    */
    .style("fill", "steelblue");


bar.append("text")
    .text(function (d) {
        return d;
    })
    .attr("x", function (d) {
        return scale(d);
    })
    .attr("y", bar_height / 2)
    .attr("text-anchor", "end");     //对齐属性


//竖直柱状图
//height变width
//坐标系也要改变
//原点平移也需要改变
//缩放也要改变

//ordinal scales 离散
//linear scales 线性

width = 1000;
height = 500;
margin = {
    left: 30,
    top: 30,
    right: 30,
    bottom: 30
};
svg_width = width + margin.left + margin.right;
svg_height = height + margin.top + margin.bottom;

//ordinal
svg = d3.select('#container')
    .append("svg:svg")
    //width,height
    .attr("width", svg_width)  //attribute
    .attr("height", svg_height)
    .attr("id", "ordinal_svg");

var chart = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

scale = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([height, 0]);

scale_x = d3.scaleBand()
    .domain(data.map(function (value) {
        return value;
    }))
    .range([0, width], 0.1);

bar = chart.selectAll("g")  //none <g>
    .data(data)     //bind data
    .enter()        //
    .append("g")        //total <g> = data.length
    .attr("transform", function (d, i) {
        return "translate(" + scale_x(d) + ",0)";
    });

x_axis = d3.axisBottom(scale_x);
y_axis = d3.axisLeft(scale);

chart.append("g")
    .call(x_axis)
    .attr("transform", "translate(0," + height + ")");
chart.append("g")
    .call(y_axis);

bar.append("rect")
    .attr("y", function (d) {
        return d;
    })
    .attr(
        "height", function (d) {
            return height - scale(d);
        }
    )
    .attr("width", scale_x.bandwidth())
    .style("fill", "steelblue");


bar.append("text")
    .text(function (d) {
        return d;
    })
    .attr("y", function (d) {
        return scale(d);
    })
    .attr("x", scale_x.bandwidth() / 2)
    .attr("text-anchor", "middle")     //对齐属性
    .attr("dy", 15);

//饼状图
//v5 d3.arc();
// v3 d3.svg.arc();
// var arc_generator=d3.arc()
//     .innerRadius(0)
//     .outerRadius(100)
//     .startAngle(0)
//     .endAngle(Math.PI / 2);

// v3 d3.layout.pie()
// v5 d3.pie().value(function(d){return d.population})
//arc.centroid()
/*
v3->v5
d3.scale.category10 ↦ d3.schemeCategory10
d3.scale.category20 ↦ d3.schemeCategory20
d3.scale.category20b ↦ d3.schemeCategory20b
d3.scale.category20c ↦ d3.schemeCategory20c
 */

//xchart

//nvd3