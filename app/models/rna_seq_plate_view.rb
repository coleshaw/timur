class RnaSeqPlateView < TimurView

  tab :overview do
    pane :default do
    end
  end

  tab :metrics do
    pane :default do
      show :total_read_distribution do
        attribute_class "HistogramAttribute"
        display_name "Total Reads Distribution"
        plot(
            name: "total_reads_distribution",
            manifest: [
                [ :data, "question(
                  [ 'rna_seq',
                    [ 'rna_seq_plate','plate_name', '::equals', @record_name ],
                    '::all', 'read_count'
                  ]
                )"]
            ],
            dimensions: {
                width: 600,
                height: 400,
                margin: { top: 10, right: 0, bottom: 100, left: 30}
            }
        )
      end

      show :composition_metric do
        attribute_class "StackedBarPlotAttribute"
        display_name "Read Composition"
        plot(
            name: "rna_seq_plate_read_composition_qc",
            manifest: [
                [ :composition, "table(
                [ 'rna_seq', [ 'rna_seq_plate', 'plate_name', '::equals', @record_name ] ],
                [
                  intergenic_count: [ 'intergenic_count' ],
                  introns_count: [ 'introns_count' ],
                  utr_count: [ 'utr_count' ],
                  coding_count: [ 'coding_count' ],
                  mt_coding_count: [ 'mt_coding_count' ],
                  rrna_count: [ 'rrna_count' ],
                  mt_rrna_count: [ 'mt_rrna_count' ]
                ],
                [ order: 'coding_count' ])"
                ],
                [ :totals, "@composition$intergenic_count + @composition$introns_count + @composition$utr_count +
                            @composition$coding_count + @composition$mt_coding_count + @composition$rrna_count +
                            @composition$mt_rrna_count + 1"
                ],
                [ :data, "[
                    intergenic_ratio: @composition$intergenic_count / @totals,
                    introns_ratio: @composition$introns_count / @totals,
                    utr_ratio: @composition$utr_count / @totals,
                    coding_ratio: @composition$coding_count / @totals,
                    mt_coding_ratio: @composition$mt_coding_count / @totals,
                    rrna_ratio: @composition$rrna_count / @totals,
                    mt_rrna_ratio: @composition$mt_rrna_count / @totals
                ]" ]
            ],
            properties: [
                { field: 'coding_ratio', label: 'coding count', color: 'magenta' },
                { field: 'intergenic_ratio', label: 'intergenic count', color: 'red' },
                { field: 'introns_ratio', label: 'introns count', color: 'green' },
                { field: 'utr_ratio', label: 'utr count', color: 'orange' },
                { field: 'mt_coding_ratio', label: 'mt coding count', color: 'cyan'},
                { field: 'rrna_ratio', label: 'rrna count', color: 'lime'},
                { field: 'mt_rrna_ratio', label: 'mt rrna count', color: 'blue'}
            ],
            order_by: 'coding_ratio',
            dimensions: {
                width: 1400,
                height: 400,
                margin: { top: 10, right: 200, bottom: 150, left: 150}
            }
        )
      end
    end
  end
end
