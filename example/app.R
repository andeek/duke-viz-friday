library(shiny)
library(ggplot2)

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
      plotOutput(outputId = "distPlot")
      
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
  
  # Histogram of randomly generated data ----
  # with requested number of bins
  output$distPlot <- renderPlot({
    
    # get randomly generated data
    x <- data()
    
    # make histogram
    print(qplot(x, bins = input$bins))
  })
  
}

shinyApp(ui = ui, server = server)