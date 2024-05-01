import { Line } from 'react-chartjs-2';
import { Chart, LineController, CategoryScale, LineElement, PointElement } from 'chart.js';

// Registering the components
Chart.register(LineController, CategoryScale, LineElement, PointElement);

function CropYieldGraph({ graphData }) {
    if (!graphData) return null;

    const options = {
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              // if it's the last data point, change the label
              if (context.dataIndex === context.dataset.data.length - 1) {
                return 'Predicted Yield (in tons): ' + context.dataset.data[context.dataIndex];
              }
              return context.dataset.label + ': ' + context.dataset.data[context.dataIndex];
            }
          }
        }
      }
    };

    return <Line data={graphData} options={options} />;
}

export default CropYieldGraph;
