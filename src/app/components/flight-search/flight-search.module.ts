import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgbDateFRParserFormatter } from '../../dateformatter/ngb-date-fr-parser-formatter';
import { FlightSearchComponent } from './flight-search.component';

@NgModule({
    declarations: [
        FlightSearchComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgbModule,
        Ng2SmartTableModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        Ng2SmartTableModule
    ],
    providers: [
        {
            provide: NgbDateParserFormatter,
            useClass: NgbDateFRParserFormatter
        }
    ],
})
export class FlightSearchModule { }

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
