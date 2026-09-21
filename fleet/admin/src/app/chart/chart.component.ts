import { Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html'
})

export class ChartComponent {
  public root!: am5.Root;

  constructor(@Inject(PLATFORM_ID) public platformId: Object, public zone: NgZone) {}

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngAfterViewInit() {
    // Chart code goes in here
    this.browserOnly(() => {
      let root = am5.Root.new("chartdiv");

      root.setThemes([am5themes_Animated.new(root)]);

      let chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panY: false,
          layout: root.verticalLayout
        })
      );
      
      let data = [{
        category: "Ocak",
        value1: 1250,
        color: "#090f3c" // Ana renk (mavi)
      }, {
        category: "Şubat",
        value1: 1400,
        color: "#3B69A7" // Daha açık mavi
      }, {
        category: "Mart",
        value1: 1300,
        color: "#497DBC" // Biraz daha açık mavi
      }, {
        category: "Nisan",
        value1: 950,
        color: "#5791D0" // Daha açık
      }, {
        category: "Mayıs",
        value1: 1624,
        color: "#65A4E3" // Hemen hemen gökyüzü mavisi
      }, {
        category: "Haziran",
        value1: 1523,
        color: "#73B7F7" // Çok açık mavi
      }, {
        category: "Temmuz",
        value1: 1201,
        color: "#81C9FF" // Buz mavisi
      }, {
        category: "Ağustos",
        value1: 1100,
        color: "#90DBFF" // Hafif açık
      }, {
        category: "Eylül",
        value1: 850,
        color: "#9EEFFF" // Daha açık
      }, {
        category: "Ekim",
        value1: 0,
        color: "#ADE1FF" // Çok açık mavi
      }, {
        category: "Kasım",
        value1: 0,
        color: "#BCE7FF" // Pastel tonlarına yakın
      }, {
        category: "Aralık",
        value1: 0,
        color: "#CAF0FF" // En açık mavi tonu
      }
    ];
    

      // Create Y-axis
      let yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {})
        })
      );

      // Create X-Axis
      let xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          renderer: am5xy.AxisRendererX.new(root, {}),
          categoryField: "category"
        })
      );
      xAxis.data.setAll(data);

      // Create series
      let series1 = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: "Poliçe Sayısı",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "value1",
          categoryXField: "category",
          tooltip: am5.Tooltip.new(root, {
            labelText: "{valueY} poliçe" // Sütunun Y eksenindeki değeri tooltip'te gösterir
          })
        })
      );

      // Çubuklara renk atamak için `set` fonksiyonu kullanılıyor
      series1.columns.template.adapters.add("fill", (fill, target) => {
        return target.dataItem?.dataContext["color"] || fill; // Her veri noktasında tanımlı olan rengi kullan
      });

      series1.data.setAll(data);

      // Add legend
      let legend = chart.children.push(am5.Legend.new(root, {}));
      legend.data.setAll(chart.series.values);

      // Add cursor
      chart.set("cursor", am5xy.XYCursor.new(root, {}));

      this.root = root;
    });
  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.root) {
        this.root.dispose();
      }
    });
  }
}
