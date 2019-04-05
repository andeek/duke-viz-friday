library(shiny)
library(ggplot2)


# Define function to make dynamic graph
# Specify the id, class is "d3graph"
dynGraph <- function(id) {
  div(id = id, class="d3graph")
}


# Define UI for app that draws a histogram from random data----
ui <- fluidPage(
  
  # App title ----
  titlePanel("Histograms!"),
  
  # Sidebar layout with input and output definitions ----
  sidebarLayout(
    
    # Sidebar panel for inputs ----
    sidebarPanel(
      
      # Input: Slider for the number of bins ----
      sliderInput(inputId = "bins",
                  label = "Number of bins:",
                  min = 1,
                  max = 50,
                  value = 30),
      
      # Input: button to generate more data
      actionButton(inputId = "new_data", 
                   label = "Generate data")
      
    ),
    
    # Main panel for displaying outputs ----
    mainPanel(
      
      # Output: Histogram ----
      # a dynamic one!
      dynGraph(id = 'd3io'),
      
      # Include the D3 library ----
      tagList(
        includeScript("https://d3js.org/d3.v4.min.js"),
        includeScript("histogram.js"),
        includeCSS("histogram.css")
      )
      
    )
  )
)

# Define server logic required to draw a histogram ----
server <- function(input, output) {
  
  # Get random data
  data <- reactive({
    # update data when button is pushed
    # reactivity means when values change, this function will update
    button_val <- input$new_data 
    
    rbeta(500, 1, 5)
  })
  
  # send data to the client ----
  output$d3io <- reactive({ 
    list(data = data(), n_bins = input$bins)
  })
  
}

shinyApp(ui = ui, server = server)