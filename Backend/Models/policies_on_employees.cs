//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Medical_Care.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class policies_on_employees
    {
        public int PoEId { get; set; }
        public string EmpNo { get; set; }
        public int PolicyId { get; set; }
        public string PolicyName { get; set; }
        public Nullable<double> PolicyAmount { get; set; }
        public decimal PolicyDuration { get; set; }
        public decimal EMI { get; set; }
        public System.DateTime PstarDate { get; set; }
        public System.DateTime PendDate { get; set; }
        public string CompanyId { get; set; }
        public string CompanyName { get; set; }
        public string Medical { get; set; }
    }
}
