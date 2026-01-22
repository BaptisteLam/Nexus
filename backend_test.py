import requests
import sys
import json
from datetime import datetime

class NexusAPITester:
    def __init__(self, base_url="https://be874f83-3583-49f1-afed-7b70647fcd7d.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, timeout=30):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout)

            success = response.status_code == expected_status
            
            result = {
                "test_name": name,
                "endpoint": endpoint,
                "method": method,
                "expected_status": expected_status,
                "actual_status": response.status_code,
                "success": success,
                "response_data": None,
                "error": None
            }

            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    result["response_data"] = response.json()
                    print(f"   Response: {json.dumps(result['response_data'], indent=2)[:200]}...")
                except:
                    result["response_data"] = response.text[:200]
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    result["response_data"] = response.json()
                except:
                    result["response_data"] = response.text[:200]

            self.test_results.append(result)
            return success, result["response_data"]

        except requests.exceptions.Timeout:
            error_msg = f"Request timeout after {timeout}s"
            print(f"❌ Failed - {error_msg}")
            self.test_results.append({
                "test_name": name,
                "endpoint": endpoint,
                "method": method,
                "expected_status": expected_status,
                "actual_status": None,
                "success": False,
                "response_data": None,
                "error": error_msg
            })
            return False, {}
        except Exception as e:
            error_msg = str(e)
            print(f"❌ Failed - Error: {error_msg}")
            self.test_results.append({
                "test_name": name,
                "endpoint": endpoint,
                "method": method,
                "expected_status": expected_status,
                "actual_status": None,
                "success": False,
                "response_data": None,
                "error": error_msg
            })
            return False, {}

    def test_health_endpoint(self):
        """Test health check endpoint"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "api/health",
            200
        )
        
        if success:
            # Verify response structure
            required_fields = ["status", "timestamp", "llm_available", "llm_key_configured"]
            for field in required_fields:
                if field not in response:
                    print(f"⚠️  Warning: Missing field '{field}' in health response")
                    return False
            
            if response.get("status") != "healthy":
                print(f"⚠️  Warning: Health status is '{response.get('status')}', expected 'healthy'")
                return False
                
            print(f"   LLM Available: {response.get('llm_available')}")
            print(f"   LLM Key Configured: {response.get('llm_key_configured')}")
        
        return success

    def test_screenshot_endpoint(self):
        """Test screenshot capture endpoint"""
        success, response = self.run_test(
            "Screenshot Capture",
            "POST",
            "api/desktop/screenshot",
            200
        )
        
        if success:
            # Verify response structure
            required_fields = ["success", "timestamp"]
            for field in required_fields:
                if field not in response:
                    print(f"⚠️  Warning: Missing field '{field}' in screenshot response")
                    return False
        
        return success

    def test_desktop_action_endpoint(self):
        """Test desktop action endpoint"""
        test_actions = [
            {
                "name": "Move Action",
                "data": {"type": "move", "payload": {"x": 100, "y": 200}}
            },
            {
                "name": "Click Action", 
                "data": {"type": "click", "payload": {"x": 150, "y": 250, "button": "left"}}
            },
            {
                "name": "Type Action",
                "data": {"type": "type", "payload": {"text": "Hello World"}}
            }
        ]
        
        all_passed = True
        for action in test_actions:
            success, response = self.run_test(
                action["name"],
                "POST",
                "api/desktop/action",
                200,
                action["data"]
            )
            
            if success:
                # Verify response structure
                required_fields = ["success", "action", "timestamp"]
                for field in required_fields:
                    if field not in response:
                        print(f"⚠️  Warning: Missing field '{field}' in action response")
                        success = False
            
            all_passed = all_passed and success
        
        return all_passed

    def test_ai_analyze_endpoint(self):
        """Test AI analysis endpoint"""
        test_requests = [
            {
                "name": "Simple Analysis",
                "data": {
                    "userIntent": "Ouvre Chrome et va sur google.com",
                    "screenshot": None
                }
            },
            {
                "name": "File Management Analysis",
                "data": {
                    "userIntent": "Range mes fichiers du bureau par type",
                    "screenshot": None
                }
            }
        ]
        
        all_passed = True
        for test_req in test_requests:
            success, response = self.run_test(
                test_req["name"],
                "POST",
                "api/ai/analyze",
                200,
                test_req["data"],
                timeout=45  # AI requests may take longer
            )
            
            if success:
                # Verify response structure
                required_fields = ["success", "response"]
                for field in required_fields:
                    if field not in response:
                        print(f"⚠️  Warning: Missing field '{field}' in AI response")
                        success = False
                
                # Check if analysis field exists
                if "analysis" in response:
                    analysis = response["analysis"]
                    analysis_fields = ["explanation", "confidence"]
                    for field in analysis_fields:
                        if field not in analysis:
                            print(f"⚠️  Warning: Missing field '{field}' in analysis")
            
            all_passed = all_passed and success
        
        return all_passed

    def test_root_endpoint(self):
        """Test root endpoint"""
        success, response = self.run_test(
            "Root Endpoint",
            "GET",
            "",
            200
        )
        
        if success:
            # Verify response structure
            required_fields = ["name", "version", "description", "endpoints"]
            for field in required_fields:
                if field not in response:
                    print(f"⚠️  Warning: Missing field '{field}' in root response")
                    return False
        
        return success

def main():
    print("🚀 Starting Nexus API Tests...")
    print("=" * 50)
    
    # Setup
    tester = NexusAPITester()
    
    # Run all tests
    test_methods = [
        ("Root Endpoint", tester.test_root_endpoint),
        ("Health Check", tester.test_health_endpoint),
        ("Screenshot Capture", tester.test_screenshot_endpoint),
        ("Desktop Actions", tester.test_desktop_action_endpoint),
        ("AI Analysis", tester.test_ai_analyze_endpoint),
    ]
    
    failed_tests = []
    
    for test_name, test_method in test_methods:
        print(f"\n📋 Running {test_name} tests...")
        try:
            if not test_method():
                failed_tests.append(test_name)
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {e}")
            failed_tests.append(test_name)
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Final Results:")
    print(f"   Tests Run: {tester.tests_run}")
    print(f"   Tests Passed: {tester.tests_passed}")
    print(f"   Success Rate: {(tester.tests_passed/tester.tests_run*100):.1f}%")
    
    if failed_tests:
        print(f"\n❌ Failed Test Categories:")
        for test in failed_tests:
            print(f"   - {test}")
    else:
        print(f"\n✅ All test categories passed!")
    
    # Save detailed results
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump({
            "timestamp": datetime.now().isoformat(),
            "summary": {
                "tests_run": tester.tests_run,
                "tests_passed": tester.tests_passed,
                "success_rate": tester.tests_passed/tester.tests_run*100 if tester.tests_run > 0 else 0,
                "failed_categories": failed_tests
            },
            "detailed_results": tester.test_results
        }, f, indent=2)
    
    return 0 if not failed_tests else 1

if __name__ == "__main__":
    sys.exit(main())