using Medical_Care.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Medical_Care.Controllers
{
    public class AdminLoginController : ApiController
    {
        private DB_MedicalCareEntities db = new DB_MedicalCareEntities();

        public HttpResponseMessage Get()
        {
            return Request.CreateResponse(HttpStatusCode.OK, db.admin_login);
        }

        public string Post(admin_login ad)
        {
            try
            {
                db.admin_login.Add(ad);
                db.SaveChanges();

                return "Added Successfully!!";
            }
            catch (Exception)
            {

                return "Failed to Add!!";
            }
        }

        public string Put(admin_login ad)
        {
            try
            {
                db.Entry(ad).State = EntityState.Modified;
                db.SaveChanges();

                return "Updated Successfully!!";
            }
            catch (Exception)
            {

                return "Failed to Update!!";
            }
        }

        public string Delete(int id)
        {
            try
            {
                admin_login ad = db.admin_login.Find(id);
                db.admin_login.Remove(ad);
                db.SaveChanges();

                return "Deleted Successfully!!";
            }
            catch (Exception)
            {

                return "Failed to Delete!!";
            }
        }
    }
}
