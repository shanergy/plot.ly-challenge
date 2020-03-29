// *************************************************************************************************
// *************************************************************************************************
// STEP 1: Plotly
// *************************************************************************************************
// *************************************************************************************************

// ************************************************************************
// 1) Use the D3 library to read in samples.json
// ************************************************************************
// Set variable to the path for samples.json data
const jsonFilepath = "/data/samples.json";

// Go get the the JSON data, read it in & console.log it
function getBellyButtonData() {
    d3.json(jsonFilepath).then(data => {

        // Get values from the data json object to use in plots and demographic info box
        let metadata = data.metadata;
        // console.log(metadata);
        let samples = data.samples;
        // console.log(samples);

        // Create variable and assign it the value from the selected test subject ID (from dropdown menu options)
        let testSubjectIdSelection = d3.select("#selDataset")
        let selectedSubjectId = testSubjectIdSelection.property("value");
        // console.log(`selectedDataset: ${selectedSubjectId}`);

        // Use filter method to create custom filtering function for selected test subject id
        function filterSample(testSubject) {
            return parseInt(testSubject.id) === parseInt(selectedSubjectId);
        };

        // Use filter() to pass the function as its argument
        let filteredMetadata = metadata.filter(filterSample)[0];
        // console.log(filteredMetadata);
        let filteredSample = samples.filter(filterSample)[0];
        // console.log(filteredSample);

        let plotOtuIds = filteredSample.otu_ids;
        // console.log(plotOtuIds);
        let plotSampleValues = filteredSample.sample_values;
        // console.log(plotSampleValues);
        let plotOtuLabels = filteredSample.otu_labels;
        // console.log(plotOtuLabels);

        // ************************************************************************
        // 2) Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
        // ************************************************************************
        // Create horizontal bar chart trace
        var barTrace1 = {
            // ***********************************************
            // * Use sample_values as the values for the bar chart.
            // * Use otu_ids as the labels for the bar chart.
            // * Use otu_labels as the hovertext for the chart.
            // ***********************************************
            type: "bar",
            orientation: "h",
            x: plotSampleValues.slice(0,10).reverse(),
            y: plotOtuIds.map(d => `OTU ${d}`).slice(0,10).reverse(),
            hovertext: plotOtuLabels.slice(0,10).reverse(),
        }
        // Create data array for the plot
        var barData = [barTrace1];
        // Define plot layout
        var barLayout = {
            // title: "xxPlaceHolderxx",                // not used
            // xaxis: { title: "xxPlaceHolderxx" },     // not used
            // yaxis: { title: "xxPlaceHolderxx" }      // not used
        };
        // Plot the chart to a div tag within html with id "bar"
        Plotly.newPlot("bar", barData, barLayout);

        // ************************************************************************
        // 3) Create a bubble chart that displays each sample.
        // ************************************************************************
        // Create bubble chart trace
        var bubbleTrace1 = {
        // ***********************************************
        // * Use otu_ids for the x values.
        // * Use sample_values for the y values.
        // * Use sample_values for the marker size.
        // * Use otu_ids for the marker colors.
        // * Use otu_labels for the text values.
        // ***********************************************
            x: plotOtuIds,
            y: plotSampleValues,
            text: plotOtuLabels,
            mode: "markers",
            marker: {
                size: plotSampleValues,
                // size: plotSampleValues.map((d) => d * 0.7),
                color: plotOtuIds,
            }
        };
        // Create data array for the plot
        var bubbleData = [bubbleTrace1];
        // Define plot layout
        var bubbleLayout = {
            // title: "xxPlaceHolderxx",                // not used
            xaxis: { title: "OTU ID" },
            // yaxis: { title: "xxPlaceHolderxx" },      // not used
        };
        // Plot the chart to a div tag within html with id "bubble"
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
        // ************************************************************************
        // 4) Display the sample metadata, i.e., an individual's demographic information.
        // ************************************************************************
        // clear/remove values if already populated so append doesn't add new p elements to the html
        d3.selectAll("#sample-metadata")
            .selectAll("p")
            .remove();
        Object.entries(filteredMetadata).forEach(([i,d]) => {
            d3.select("#sample-metadata")
                .append("p")
                .text(`${i}: ${d}`);
        });
    });
};

function init() {
    d3.json(jsonFilepath).then(data => {
        // Get values from the data json object to use as dropdown menu options
        let dropdownMenuOptions = data.names;
        // Populate dropdown menu with Test Subject ID options to choose from to filter data and plots with
        dropdownMenuOptions.forEach(x => {
            d3.select("#selDataset")
                .append("option")
                .text(x)
                .property("value", x);
            });
    });
    // Call the getBellyButtonData function to populate the plots and data on the page for the selected Test Subject ID (default is 940, first selection)
    getBellyButtonData();
};

init();

// Call optionChanged() when a change takes place to the DOM
d3.selectAll("#selDataset").on("change", optionChanged);

function optionChanged(selectedDropdownValue) {
    getBellyButtonData();
    // console.log(`The input value has changed. The new value is: ${selectedDropdownValue}`);
};
